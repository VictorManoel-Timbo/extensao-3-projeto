import logging

import dspy
from django.conf import settings
from django.db import transaction
from django.http import Http404
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import serializers, status
from rest_framework.exceptions import APIException
from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.response import Response
from rest_framework.throttling import UserRateThrottle

from foodguard.api.exceptions.chat import ChatClosedException
from foodguard.api.exceptions.message import RoleNotAllowedException
from foodguard.api.serializers.message import MessageSerializer
from foodguard.core.models.anamnese import Anamnese
from foodguard.core.models.chat import Chat
from foodguard.core.models.message import Message
from foodguard.core.services.gemini_client import GeminiClient
from foodguard.core.services.openai_client import OpenAIClient

logger = logging.getLogger('django')


class AIThrottle(UserRateThrottle):
    """Throttle dedicado aos endpoints de IA (rate definido em settings)."""
    scope = 'ai'


def _build_ai_client():
    if settings.AI_PROVIDER == "openai":
        return OpenAIClient()
    return GeminiClient()


_ai_client = None


def get_ai_client():
    """Lazy singleton — evita instanciar o client (e exigir API key) no import,
    o que quebraria commands como migrate/collectstatic."""
    global _ai_client
    if _ai_client is None:
        _ai_client = _build_ai_client()
    return _ai_client


def _format_anamnesis(anamnese: Anamnese) -> str:
    lines = [
        f"Estilo alimentar: {anamnese.get_eating_style_display()}",
        f"Sentimento sobre o corpo e alimentação: {anamnese.get_body_feeling_display() or 'Não informado'}",
        f"Consumo de álcool: {'Sim' if anamnese.alcohol_intake else 'Não'}",
        f"Tabagismo: {'Sim' if anamnese.smoking else 'Não'}",
        f"Alergias alimentares: {anamnese.food_allergies or 'Nenhuma relatada'}",
        f"Intolerâncias alimentares: {anamnese.food_intolerances or 'Nenhuma relatada'}",
        f"Alimentos favoritos: {anamnese.favorite_foods or 'Não informado'}",
        f"Aversões alimentares: {anamnese.food_aversions or 'Nenhuma relatada'}",
        f"Histórico de doenças: {anamnese.disease_history or 'Nenhum relatado'}",
        f"Medicamentos em uso: {anamnese.medications or 'Nenhum'}",
    ]
    if anamnese.previous_consultation:
        lines.append(
            f"Consulta prévia com nutricionista — Objetivo: {anamnese.previous_consultation_objective}"
        )
        if anamnese.previous_consultation_result:
            lines.append(f"Resultado da consulta: {anamnese.previous_consultation_result}")

    return "\n".join(lines)


_NUTRIMENT_FIELDS = [
    ("energy-kcal_100g", "Energia", "kcal"),
    ("carbohydrates_100g", "Carboidratos", "g"),
    ("sugars_100g", "Açúcares", "g"),
    ("fat_100g", "Gorduras totais", "g"),
    ("saturated-fat_100g", "Gorduras saturadas", "g"),
    ("fiber_100g", "Fibras", "g"),
    ("proteins_100g", "Proteínas", "g"),
    ("salt_100g", "Sal", "g"),
    ("sodium_100g", "Sódio", "g"),
]


def _format_nutriments(nutriments: dict | None) -> str:
    if not nutriments:
        return ""
    parts = [
        f"{label}: {nutriments[key]}{unit}"
        for key, label, unit in _NUTRIMENT_FIELDS
        if nutriments.get(key) is not None
    ]
    return "; ".join(parts)


def _format_food_data(food_data: dict | None) -> str:
    if not food_data:
        return "Nenhum produto específico fornecido. Análise baseada apenas na query do usuário."

    product = food_data.get('product', {})
    product_name = product.get('product_name') or 'Nome não disponível'

    ingredients = product.get('ingredients', [])
    ingredient_list = ", ".join(
        f"{ing['text']} ({ing.get('percent_estimate', 0):.1f}%)"
        for ing in ingredients
        if ing.get('text')
    )
    if not ingredient_list:
        ingredient_list = (product.get('ingredients_text') or "").strip()

    allergens = ", ".join(product.get('allergens_tags', [])) or "Nenhum declarado"
    additives = ", ".join(product.get('additives_tags', [])) or "Nenhum"

    lines = [
        f"Produto: {product_name}",
        f"Ingredientes: {ingredient_list or 'Não disponível'}",
        f"Alérgenos declarados: {allergens}",
        f"Aditivos: {additives}",
    ]

    nutriments = _format_nutriments(product.get('nutriments'))
    if nutriments:
        lines.append(f"Informação nutricional (por 100g): {nutriments}")

    return "\n".join(lines)


def _build_history(chat: Chat, exclude_message_id) -> dspy.History:
    """Monta o histórico DSPy pareando mensagens U -> A em ordem cronológica.

    Exclui a mensagem de usuário recém-salva (a que está sendo respondida agora).
    """
    messages = (
        Message.objects.filter(chat=chat)
        .exclude(id=exclude_message_id)
        .order_by('created_at')
    )

    turns = []
    pending_user = None
    for message in messages:
        if message.role == Message.Role.USER:
            if pending_user is not None:
                logger.warning(
                    "Mensagem de usuário sem resposta da IA no chat %s; "
                    "incluindo turno com answer vazia.", chat.id,
                )
                turns.append({"user_query": pending_user, "answer": ""})
            pending_user = message.content
        elif message.role == Message.Role.ASSISTANT and pending_user is not None:
            turns.append({"user_query": pending_user, "answer": message.content})
            pending_user = None

    return dspy.History(messages=turns)


@extend_schema(
    summary="Cria uma nova mensagem de chat",
    description=(
        "Recebe o texto do usuário e, opcionalmente, dados de produto via OpenFoodFacts. "
        "Na primeira interação (ou quando um produto é enviado) executa o pipeline DSPy de "
        "análise de segurança alimentar e retorna o veredito estruturado (verdict). Em "
        "mensagens de acompanhamento sem produto, responde em modo conversacional usando o "
        "histórico do chat (verdict = null). O modo conversacional requer AI_PROVIDER=openai."
    ),
    responses={
        201: inline_serializer(
            name="MessageCreateResponse",
            fields={
                "chat_id": serializers.UUIDField(),
                "response": serializers.CharField(),
                "verdict": serializers.ChoiceField(
                    choices=["SAFE", "DANGEROUS"], allow_null=True
                ),
                "recommends_doctor": serializers.BooleanField(),
            },
        )
    },
)
class MessageCreateAPIView(CreateAPIView):
    serializer_class = MessageSerializer
    throttle_classes = [AIThrottle]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        role = serializer.validated_data.get('role')
        if role == Message.Role.ASSISTANT:
            raise RoleNotAllowedException()

        chat_id = serializer.validated_data.get('chat_id')
        user_message_content = serializer.validated_data.get('content', '')

        ai_client = get_ai_client()
        food_data = serializer.validated_data.get('food_data')

        try:
            with transaction.atomic():
                if not chat_id:
                    chat = Chat.objects.create(
                        user=request.user, title=user_message_content[:15]
                    )
                else:
                    chat = get_object_or_404(Chat, id=chat_id, user=request.user)

                if not chat.is_active:
                    raise ChatClosedException()

                has_prior_assistant = Message.objects.filter(
                    chat=chat, role=Message.Role.ASSISTANT
                ).exists()
                supports_conversation = hasattr(ai_client, "continue_conversation")
                is_follow_up = (
                    not food_data and has_prior_assistant and supports_conversation
                )

                user_message = serializer.save(chat=chat)

                anamnese = Anamnese.objects.filter(user=request.user).first()
                user_anamnesis = (
                    _format_anamnesis(anamnese) if anamnese else "Anamnese não disponível."
                )

                if is_follow_up:
                    result = ai_client.continue_conversation(
                        user_anamnesis=user_anamnesis,
                        food_context=_format_food_data(food_data),
                        history=_build_history(chat, exclude_message_id=user_message.id),
                        user_query=user_message.content,
                    )
                    ai_content = result["response"]
                    verdict = None
                else:
                    result = ai_client.assess_safety(
                        user_anamnesis=user_anamnesis,
                        food_ingredients=_format_food_data(food_data),
                        user_query=user_message.content,
                    )
                    ai_content = result["explanation"]
                    verdict = result["verdict"]

                ai_message = Message.objects.create(
                    chat=chat,
                    role=Message.Role.ASSISTANT,
                    content=ai_content,
                )
        except (Http404, APIException):
            raise
        except Exception as e:
            logger.error("Erro no pipeline de IA: %s", str(e), exc_info=True)
            return Response(
                {"error": "Erro ao processar sua resposta"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(
            {
                "chat_id": chat.id,
                "response": ai_message.content,
                "verdict": verdict,
                "recommends_doctor": result["recommends_doctor"],
            },
            status=status.HTTP_201_CREATED,
        )


@extend_schema(summary="Lista mensagens de um chat específico do usuário")
class MessageListAPIView(ListAPIView):
    serializer_class = MessageSerializer

    def get_queryset(self):
        chat_id = self.kwargs['chat_id']
        return (
            Message.objects.filter(chat_id=chat_id, chat__user=self.request.user)
            .order_by('created_at')
        )
