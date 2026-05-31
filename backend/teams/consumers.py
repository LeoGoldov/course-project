import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Team


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
        if data.get('type') == 'increment_views':
            await self.update_views()
            views = await self.get_views_count()
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'views_updated',
                    'views': views
                }
            )

    async def views_updated(self, event):
        await self.send(text_data=json.dumps({
            'type': 'views_updated',
            'views': event['views']
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