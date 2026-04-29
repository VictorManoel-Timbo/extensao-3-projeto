from drf_spectacular.utils import extend_schema
from rest_framework.generics import ListAPIView
from rest_framework.generics import DestroyAPIView

from foodguard.api.serializers.chat import ChatSerializer
from foodguard.core.models.chat import Chat

@extend_schema(summary="Lista chats do usuário")
class ChatListAPIView(ListAPIView):
    serializer_class = ChatSerializer
    
    def get_queryset(self):
        return Chat.objects.filter(user=self.request.user).order_by('-created_at')

@extend_schema(summary="Deleta um chat específico do usuário")
class ChatDestroyAPIView(DestroyAPIView):
    serializer_class = ChatSerializer
    lookup_url_kwarg = 'chat_id'

    def get_queryset(self):
        return Chat.objects.filter(id=self.kwargs['chat_id'], user=self.request.user)