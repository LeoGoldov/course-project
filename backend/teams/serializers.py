# teams/serializers.py
from rest_framework import serializers
from .models import TechStack, Team, Comment


class TechStackSerializer(serializers.ModelSerializer):
    """Сериализатор для стека технологий"""
    team_count = serializers.IntegerField(source='team_set.count', read_only=True)

    class Meta:
        model = TechStack
        fields = ['id', 'title', 'team_count']

'''"""Сериализатор для списка команд (краткая информация)"""'''

class TeamListSerializer(serializers.ModelSerializer):
    stack_title = serializers.CharField(source='stack.title', read_only=True)
    captain_name = serializers.CharField(source='captain.username', read_only=True)

    class Meta:
        model = Team
        fields = ['id', 'title', 'created_at', 'views', 'stack_title', 'captain_name', 'logo', 'is_published']


class TeamDetailSerializer(serializers.ModelSerializer):
    """Сериализатор для детального просмотра команды"""
    stack = TechStackSerializer(read_only=True)
    captain = serializers.StringRelatedField(read_only=True)
    members = serializers.StringRelatedField(many=True, read_only=True)

    class Meta:
        model = Team
        fields = '__all__'


class TeamCreateUpdateSerializer(serializers.ModelSerializer):
    """Сериализатор для создания и обновления команды"""

    class Meta:
        model = Team
        fields = ['title', 'description', 'stack', 'logo', 'is_published']



class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'team', 'text', 'author_name', 'created_at']
        read_only_fields = ['id', 'author_name', 'created_at']