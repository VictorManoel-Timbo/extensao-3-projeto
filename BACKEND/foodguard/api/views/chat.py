from rest_framework.generics import ListAPIView
from rest_framework.generics import UpdateAPIView
from rest_framework.generics import DestroyAPIView

from foodguard.api.serializers.chat import ChatSerializer
from foodguard.core.models.chat import Chat


class ChatListAPIView(ListAPIView):
    serializer_class = ChatSerializer
    
    def get_queryset(self):
        return Chat.objects.filter(user=self.request.user).order_by('-created_at')

class ChatUpdateAPIView(UpdateAPIView):
    serializer_class = ChatSerializer
    
    def get_queryset(self):
        return Chat.objects.filter(id=self.kwargs['chat_id'])

class ChatDestroyAPIView(DestroyAPIView):
    serializer_class = ChatSerializer

    def get_queryset(self):
        return Chat.objects.filter(id=self.kwargs['chat_id'])