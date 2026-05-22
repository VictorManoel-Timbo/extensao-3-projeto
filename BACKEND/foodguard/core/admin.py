from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from foodguard.users.models import User
from foodguard.core.models import Anamnese, Chat, Message

admin.site.register(User, UserAdmin)

@admin.register(Anamnese)
class AnamneseAdmin(admin.ModelAdmin):
    list_display = ('user', 'previous_consultation', 'alcohol_intake', 'smoking')
    search_fields = ('user__username',)
    list_filter = ('previous_consultation', 'alcohol_intake', 'smoking')

@admin.register(Chat)
class ChatAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at')
    search_fields = ('user__username',)
    list_filter = ('created_at',)

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('chat', 'role', 'created_at')
    search_fields = ['chat__user__username']
    list_filter = ('created_at',)