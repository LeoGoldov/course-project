# backend/teams/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Team, Comment
from django.contrib.auth import get_user_model

User = get_user_model()


class TeamConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.team_id = self.scope['url_route']['kwargs']['team_id']
        self.room_group_name = f'team_{self.team_id}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

        # Отправляем текущее количество просмотров
        views = await self.get_views_count()
        await self.send(text_data=json.dumps({
            'type': 'views_updated',
            'views': views
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get('type')

        if message_type == 'increment_views':
            await self.update_views()
            views = await self.get_views_count()
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'views_updated',
                    'views': views
                }
            )

        elif message_type == 'new_comment':
            # Сохраняем комментарий
            comment = await self.save_comment(data.get('text'), data.get('user_id'))
            # Рассылаем всем в комнате
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'new_comment',
                    'comment': comment
                }
            )

    async def views_updated(self, event):
        await self.send(text_data=json.dumps({
            'type': 'views_updated',
            'views': event['views']
        }))

    async def new_comment(self, event):
        await self.send(text_data=json.dumps({
            'type': 'new_comment',
            'comment': event['comment']
        }))

    @database_sync_to_async
    def update_views(self):
        team = Team.objects.get(pk=self.team_id)
        team.views += 1
        team.save(update_fields=['views'])

    @database_sync_to_async
    def get_views_count(self):
        team = Team.objects.get(pk=self.team_id)
        return team.views

    @database_sync_to_async
    def save_comment(self, text, user_id):
        team = Team.objects.get(pk=self.team_id)
        user = User.objects.get(pk=user_id)
        comment = Comment.objects.create(
            team=team,
            author=user,
            text=text
        )
        return {
            'id': comment.id,
            'text': comment.text,
            'author_name': user.username,
            'created_at': comment.created_at.strftime('%d.%m.%Y %H:%M')
        }