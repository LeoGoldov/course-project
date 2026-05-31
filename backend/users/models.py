from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    bio = models.TextField(verbose_name='О себе', blank=True)
    avatar = models.ImageField(upload_to='avatars/%Y/%m/%d', verbose_name='Аватар', blank=True)
    phone = models.CharField(max_length=20, verbose_name='Телефон', blank=True)

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'

    def __str__(self):
        return self.username

class Comment(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='comments', verbose_name='Команда')
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