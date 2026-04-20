from rest_framework.generics import CreateAPIView
from rest_framework.generics import ListAPIView
from django.shortcuts import get_object_or_404

from foodguard.api.serializers.message import MessageSerializer
from foodguard.core.models.message import Message
from foodguard.core.models.chat import Chat
from foodguard.api.exceptions.chat import ChatClosedException
from foodguard.api.exceptions.message import RoleNotAllowedException

class MessageCreateAPIView(CreateAPIView):
    serializer_class = MessageSerializer

    def perform_create(self, serializer):
        role = serializer.validated_data.get('role')
        if role == 'system':
            raise RoleNotAllowedException()
    
        chat_id = self.request.data.get('chat_id')
        
        if not chat_id:
            message = serializer.validated_data.get('content', '')
            chat = Chat.objects.create(user=self.request.user, title=message[:15])
        else:
            chat = get_object_or_404(Chat, id=chat_id)

        if not chat.is_active:
            raise ChatClosedException()

        serializer.save(chat=chat)

class MessageListAPIView(ListAPIView):
    serializer_class = MessageSerializer

    def get_queryset(self):
        chat_id = self.kwargs['chat_id']
        return Message.objects.filter(chat_id=chat_id).order_by('created_at')