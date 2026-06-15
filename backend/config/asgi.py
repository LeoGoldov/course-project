import os
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# Сначала получаем ASGI приложение для HTTP (это загружает Django)
django_asgi_app = get_asgi_application()

# А теперь импортируем всё, что зависит от Django
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.urls import path
from teams import consumers

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AuthMiddlewareStack(
        URLRouter([
            path("ws/teams/<int:team_id>/", consumers.TeamConsumer.as_asgi()),
            path("ws/notifications/", consumers.NotificationConsumer.as_asgi()),
        ])
    ),
})