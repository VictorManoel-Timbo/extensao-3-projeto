import logging
from django.conf import settings
from google import genai
from google.genai import types


logger = logging.getLogger('django')

class GeminiClient:
    def __init__(self, model_id=None, system_prompt=None, temperature=None):
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        self.model_id = model_id or settings.GEMINI_MODEL_NAME
        
        self._system_instruction = system_prompt or self._load_system_prompt()

        self.config = types.GenerateContentConfig(
            system_instruction=self._system_instruction,
            temperature=temperature or settings.GEMINI_TEMPERATURE,
        )

    def generate_response(self, prompt):
        try:
            response = self.client.models.generate_content(
                model=self.model_id,
                contents=prompt,
                config=self.config
            )
            return response.text
        except Exception as e:
            logger.error(f"Erro na conexão com Gemini: {str(e)}", exc_info=True)
            raise e

    def _load_system_prompt(self):
        try:
            with open(settings.SYSTEM_PROMPT_PATH, 'r', encoding='utf-8') as f:
                return f.read()
        except Exception as e:
            logger.error(f"Erro ao carregar arquivo de prompt: {e}")
            return "Você é um assistente nutricional útil."