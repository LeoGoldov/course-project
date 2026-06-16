from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from .models import TechStack, Team, Comment, Favorite

User = get_user_model()


class TeamModelTest(TestCase):
    """Тесты для моделей команд"""

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.stack = TechStack.objects.create(title='Python + Django')
        self.team = Team.objects.create(
            title='Test Team',
            description='Test Description',
            stack=self.stack,
            captain=self.user
        )

    def test_team_creation(self):
        """Тест создания команды"""
        self.assertEqual(self.team.title, 'Test Team')
        self.assertEqual(self.team.captain.username, 'testuser')
        self.assertEqual(self.team.views, 0)
        self.assertTrue(self.team.is_published)

    def test_team_str(self):
        """Тест строкового представления команды"""
        self.assertEqual(str(self.team), 'Test Team')

    def test_techstack_str(self):
        """Тест строкового представления стека"""
        self.assertEqual(str(self.stack), 'Python + Django')


class TeamAPITest(TestCase):
    """Тесты для API команд"""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.stack = TechStack.objects.create(title='Python + Django')
        self.team_data = {
            'title': 'New Team',
            'description': 'New Description',
            'stack': self.stack.id,
            'is_published': True
        }
        # Авторизация
        response = self.client.post('/api/auth/login/', {
            'username': 'testuser',
            'password': 'testpass123'
        })
        self.token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')

    def test_create_team(self):
        """Тест создания команды через API"""
        response = self.client.post('/api/teams/', self.team_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Team.objects.count(), 1)
        self.assertEqual(Team.objects.first().title, 'New Team')
        self.assertEqual(Team.objects.first().captain.username, 'testuser')

    def test_list_teams(self):
        """Тест получения списка команд"""
        Team.objects.create(
            title='Team 1',
            description='Desc 1',
            stack=self.stack,
            captain=self.user
        )
        response = self.client.get('/api/teams/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_unauthorized_create(self):
        """Тест создания команды без авторизации"""
        self.client.credentials()  # Убираем токен
        response = self.client.post('/api/teams/', self.team_data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class CommentTest(TestCase):
    """Тесты для комментариев"""

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.stack = TechStack.objects.create(title='Python + Django')
        self.team = Team.objects.create(
            title='Test Team',
            description='Test Description',
            stack=self.stack,
            captain=self.user
        )
        self.comment = Comment.objects.create(
            team=self.team,
            author=self.user,
            text='Test comment'
        )

    def test_comment_creation(self):
        """Тест создания комментария"""
        self.assertEqual(self.comment.text, 'Test comment')
        self.assertEqual(self.comment.author.username, 'testuser')
        self.assertEqual(self.comment.team.title, 'Test Team')

    def test_comment_str(self):
        """Тест строкового представления комментария"""
        expected = f'Комментарий от testuser к {self.team.title}'
        self.assertEqual(str(self.comment), expected)


class FavoriteTest(TestCase):
    """Тесты для избранного"""

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.stack = TechStack.objects.create(title='Python + Django')
        self.team = Team.objects.create(
            title='Test Team',
            description='Test Description',
            stack=self.stack,
            captain=self.user
        )
        self.favorite = Favorite.objects.create(
            user=self.user,
            team=self.team
        )

    def test_favorite_creation(self):
        """Тест добавления в избранное"""
        self.assertEqual(self.favorite.user.username, 'testuser')
        self.assertEqual(self.favorite.team.title, 'Test Team')

    def test_favorite_str(self):
        """Тест строкового представления избранного"""
        expected = f'testuser -> {self.team.title}'
        self.assertEqual(str(self.favorite), expected)