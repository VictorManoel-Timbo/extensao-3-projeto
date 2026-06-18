from django.conf import settings
from django.db import models

from foodguard.core.models.base import BaseModel


class Chat(BaseModel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="chats"
    )
    title = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        default="Nova conversa"
    )
    # Chat "aberto" (pode receber mensagens). Fechado (False) quando a anamnese é
    # atualizada (RN004): permanece visível no histórico, mas só leitura.
    # OBS: distinto de `is_active` (BaseModel), que é usado para soft delete.
    is_open = models.BooleanField(default=True)

    class Meta:
        indexes = [
            models.Index(fields=['user', '-created_at']),
        ]
