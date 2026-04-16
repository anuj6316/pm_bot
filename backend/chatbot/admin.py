from django.contrib import admin
from .models import Conversation, Message


class MessageInline(admin.TabularInline):
    model = Message
    fields = ("role", "content", "tool_calls", "created_at")
    readonly_fields = ("role", "content", "tool_calls", "created_at")
    extra = 0
    show_change_link = False
    can_delete = False
    ordering = ("created_at",)


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "title", "message_count", "created_at", "updated_at")
    list_filter = ("user",)
    search_fields = ("id", "title", "user__username", "user__email")
    readonly_fields = ("id", "created_at", "updated_at")
    inlines = [MessageInline]
    ordering = ("-updated_at",)

    def message_count(self, obj):
        return obj.messages.count()

    message_count.short_description = "Messages"


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ("id", "conversation", "role", "content_preview", "created_at")
    list_filter = ("role",)
    search_fields = ("conversation__id", "content")
    readonly_fields = ("id", "created_at")
    ordering = ("-created_at",)

    def content_preview(self, obj):
        return obj.content[:80] + "..." if len(obj.content) > 80 else obj.content

    content_preview.short_description = "Content"
