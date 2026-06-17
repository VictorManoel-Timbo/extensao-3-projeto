from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _

from foodguard.core.models.base import BaseModel
from foodguard.core.models.chat import Chat


class Message(BaseModel):
    class Role(models.TextChoices):
        USER = 'U', _('Usuário')
        ASSISTANT = 'A', _('Assistente')
    
    chat = models.ForeignKey(
        Chat,
        on_delete=models.CASCADE,
        related_name="messages"
    )
    role = models.CharField(
        max_length=1,
        choices=Role.choices
    )
    content = models.TextField(
        max_length=5000
    )

    class Meta:
        verbose_name = "Mensagem"
        verbose_name_plural = "Mensagens"
        indexes = [
            models.Index(fields=['chat', 'created_at']),
        ]