from django.shortcuts import render
# backend/users/views.py
from rest_framework import generics, permissions
from .serializers import RegisterSerializer, ProfileUpdateSerializer, UserSerializer
from django.contrib.auth import get_user_model
from .models import TechStack, Team, Comment
from .serializers import CommentSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


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