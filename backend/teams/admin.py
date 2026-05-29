from django.contrib import admin
from .models import TechStack, Team

@admin.register(TechStack)
class TechStackAdmin(admin.ModelAdmin):
    list_display = ('id', 'title')
    search_fields = ('title',)

@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'stack', 'captain', 'created_at', 'is_published', 'views')
    list_filter = ('is_published', 'stack')
    search_fields = ('title', 'description')
    readonly_fields = ('views', 'created_at', 'updated_at')