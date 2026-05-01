from rest_framework.serializers import ModelSerializer
from rest_framework.serializers import UUIDField

from foodguard.core.models.message import Message


class MessageSerializer(ModelSerializer):
    chat_id = UUIDField(source='chat.id', read_only=True)

    class Meta:
        model = Message
        fields = ['chat_id', 'role', 'content', 'created_at']