from abc import ABC
from django.conf import settings


class AbstractLLMClient(ABC):
    def __init__(self, models_provider=None, llm_model_id=None, embedding_model_id=None):
        self.models_provider = models_provider or settings.LLM_MODELS_PROVIDER
        self.llm_model_id = llm_model_id or settings.LLM_MODEL_ID
        self.embedding_model_id = embedding_model_id or settings.EMBEDDING_MODEL_ID

    @abstractmethod
    def invoke(self, prompt, messages=None, tools=None, **kwargs):
        pass

    @abstractmethod
    def get_embedding(self, text):
        pass

    def _build_assistant_message(self, content):
        return {"role": "assistant", "content": content}

    def _build_user_message(self, content):
        return {"role": "user", "content": content}