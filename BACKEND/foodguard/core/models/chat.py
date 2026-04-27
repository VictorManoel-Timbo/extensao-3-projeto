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
