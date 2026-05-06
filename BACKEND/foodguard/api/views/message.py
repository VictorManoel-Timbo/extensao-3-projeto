import logging
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from foodguard.api.serializers.message import MessageSerializer
from foodguard.core.models.message import Message
from foodguard.core.models.chat import Chat
from foodguard.api.exceptions.chat import ChatClosedException
from foodguard.api.exceptions.message import RoleNotAllowedException
from foodguard.core.services.gemini_client import GeminiClient

gemini_client = GeminiClient()
logger = logging.getLogger('django')

@extend_schema(
    summary="Cria uma nova mensagem de chat", 
    description="Este endpoint recebe um texto e processa a resposta usando o modelo Gemini.", 
    responses={201: str}
    )
class MessageCreateAPIView(CreateAPIView):
    serializer_class = MessageSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        role = serializer.validated_data.get('role')
        if role == Message.Role.ASSISTANT:
            raise RoleNotAllowedException()

        chat_id = request.data.get('chat_id')
        user_message_content = serializer.validated_data.get('content', '')

        if not chat_id:
            chat = Chat.objects.create(user=self.request.user, title=user_message_content[:15])
        else:
            chat = get_object_or_404(Chat, id=chat_id)

        if not chat.is_active:
            raise ChatClosedException()

        user_message = serializer.save(chat=chat)

        try:
            ai_response_text = gemini_client.generate_response(user_message.content)
        except Exception as e:
            logger.error(f"Erro de cliente na API: {e}")
            return Response({"error": "Erro ao processar sua resposta"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        ai_message = Message.objects.create(
            chat=chat,
            role=Message.Role.ASSISTANT,
            content=ai_response_text
        )

        response_data = {
            "chat_id": chat.id,
            "response": ai_message.content,
        }

        return Response(response_data, status=status.HTTP_201_CREATED)

@extend_schema(summary="Lista mensagens de um chat específico do usuário")
class MessageListAPIView(ListAPIView):
    serializer_class = MessageSerializer

    def get_queryset(self):
        chat_id = self.kwargs['chat_id']
        return Message.objects.filter(chat_id=chat_id).order_by('created_at')