from django.db import models
from django.conf import settings


class TechStack(models.Model):
    title = models.CharField(max_length=150, db_index=True, verbose_name='Стек технологий')

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Стек технологий'
        verbose_name_plural = 'Стеки технологий'
        ordering = ['title']


class Team(models.Model):
    title = models.CharField(max_length=200, verbose_name='Название команды')
    description = models.TextField(verbose_name='Описание команды')
    stack = models.ForeignKey(TechStack, on_delete=models.PROTECT, verbose_name='Основной стек')
    captain = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='captained_teams',
        verbose_name='Капитан'
    )
    members = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='teams',
        blank=True,
        verbose_name='Участники'
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')
    logo = models.ImageField(upload_to='team_logos/%Y/%m/%d', blank=True, verbose_name='Логотип')
    is_published = models.BooleanField(default=True, verbose_name='Опубликовано')
    views = models.IntegerField(default=0, verbose_name='Просмотры')

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Команда'
        verbose_name_plural = 'Команды'
        ordering = ['-created_at']


# backend/teams/models.py (добавить в самый конец)

class Comment(models.Model):
    team = models.ForeignKey('Team', on_delete=models.CASCADE, related_name='comments', verbose_name='Команда')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='comments',
                               verbose_name='Автор')
    text = models.TextField(verbose_name='Текст комментария')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')

    class Meta:
        verbose_name = 'Комментарий'
        verbose_name_plural = 'Комментарии'
        ordering = ['created_at']

    def __str__(self):
        return f'Комментарий от {self.author.username} к {self.team.title}'

# Избранное
class Favorite(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='favorites')
    team = models.ForeignKey('Team', on_delete=models.CASCADE, related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'team')
        verbose_name = 'Избранное'
        verbose_name_plural = 'Избранное'

    def __str__(self):
        return f'{self.user.username} -> {self.team.title}'


