from django.conf import settings
from django.db import models

from foodguard.core.models.base import BaseModel
from foodguard.core.models.chat import Chat


class Message(BaseModel):
    ROLE_CHOICES = [
        ('user', 'Usuário'),
        ('system', 'Sistema'),
    ]
    chat = models.ForeignKey(
        Chat,
        on_delete=models.CASCADE,
        related_name="messages"
    )
    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES
    )
    content = models.TextField(
        max_length=5000
    )