from django.urls import path
from django.urls import include

urlpatterns = [
    path('chats/', include('foodguard.api.urls.message')),
    path('chats/', include('foodguard.api.urls.chat')),
]