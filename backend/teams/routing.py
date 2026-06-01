# backend/teams/routing.py
from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/teams/<int:team_id>/', consumers.TeamConsumer.as_asgi()),
]