import logging

import dspy
from django.conf import settings

from foodguard.core.services.ai_signatures import ExtractUserContext

logger = logging.getLogger('django')


class ContextExtractorClient:
    """Modelo auxiliar (leve) que extrai fatos duráveis do usuário da mensagem.

    Roda em paralelo ao modelo principal. Usa `dspy.context(lm=...)` por chamada
    para não interferir na configuração global usada pelos outros clients.
    """

    def __init__(self):
        self._lm = dspy.LM(
            model=f"openai/{settings.CONTEXT_MODEL_NAME}",
            api_key=settings.OPENAI_API_KEY,
            temperature=0,
        )
        self._extract = dspy.Predict(ExtractUserContext)

    def extract(
        self,
        user_message: str,
        existing_anamnesis: str,
        existing_context: str,
    ) -> list[str]:
        try:
            with dspy.context(lm=self._lm, adapter=dspy.JSONAdapter()):
                result = self._extract(
                    user_message=user_message,
                    existing_anamnesis=existing_anamnesis or "Nenhuma.",
                    existing_context=existing_context or "Nenhum.",
                )
            facts = result.new_facts or []
            # Normaliza: só strings não vazias.
            return [f.strip() for f in facts if isinstance(f, str) and f.strip()]
        except Exception as e:
            logger.error("Falha na extração de contexto do usuário: %s", str(e), exc_info=True)
            return []
