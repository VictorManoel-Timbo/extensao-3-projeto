from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _

from foodguard.core.models.base import BaseModel
from foodguard.core.models.chat import Chat


class Message(BaseModel):
    class Role(models.TextChoices):
        USER = 'U', _('Usuário')
        ASSISTANT = 'A', _('Assistente')

    class Status(models.TextChoices):
        CRIADA = 1, _('Criada')        
        PROCESSANDO = 2, _('Processando')
        CONCLUIDA = 3, _('Concluída')
        FALHA = 4, _('Falha')
    
    chat = models.ForeignKey(
        Chat,
        on_delete=models.CASCADE,
        related_name="messages"
    )
    role = models.CharField(
        max_length=10,
        choices=Role.choices
    )
    status = models.IntegerField(
        choices=Status.choices,
        default=Status.CRIADA
    )
    content = models.TextField(
        max_length=5000
    )

    class Meta:
        verbose_name = "Mensagem"
        verbose_name_plural = "Mensagens"