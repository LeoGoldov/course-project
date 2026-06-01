from django.shortcuts import render
# teams/views.py
from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import TechStack, Team, Comment
from .serializers import (
    TechStackSerializer,
    TeamListSerializer,
    TeamDetailSerializer,
    TeamCreateUpdateSerializer,
    CommentSerializer
)
from .permissions import IsCaptainOrReadOnly


class TechStackViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet для стека технологий (только чтение)"""
    queryset = TechStack.objects.all()
    serializer_class = TechStackSerializer
    permission_classes = [permissions.AllowAny]


class TeamViewSet(viewsets.ModelViewSet):
    """ViewSet для команд"""
    queryset = Team.objects.filter(is_published=True)
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'views']

    def get_serializer_class(self):
        if self.action == 'list':
            return TeamListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return TeamCreateUpdateSerializer
        return TeamDetailSerializer

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsCaptainOrReadOnly()]
        elif self.action == 'create':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(captain=self.request.user)

    @action(detail=True, methods=['post'])
    def increment_views(self, request, pk=None):
        """Увеличиваем счётчик просмотров"""
        team = self.get_object()
        team.views += 1
        team.save(update_fields=['views'])
        return Response({'views': team.views})

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def my_teams(self, request):
        """Команды, где пользователь является капитаном"""
        teams = Team.objects.filter(captain=request.user)
        serializer = self.get_serializer(teams, many=True)
        return Response(serializer.data)
# Create your views here.
# backend/teams/views.py (добавить в самом конце)

class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        team_id = self.request.query_params.get('team')
        if team_id:
            return Comment.objects.filter(team_id=team_id)
        return Comment.objects.all()

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)