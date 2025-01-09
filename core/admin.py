# core/admin.py
from django.contrib import admin
from .models import Project, Service, ContactMessage

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'client', 'date')
    search_fields = ('title', 'description', 'client')
    list_filter = ('date', 'client')
    ordering = ('-date',)  # Most recent projects first

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('title', 'order', 'description')
    search_fields = ('title', 'description')
    list_editable = ('order',)
    ordering = ('order',)

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('name', 'email', 'message')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)

    def has_add_permission(self, request):
        return False  # Prevents adding messages through admin