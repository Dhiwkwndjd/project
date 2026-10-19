from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase

from .models import UserProfile


class AuthenticationTests(APITestCase):
    """Проверяем основные сценарии JWT-аутентификации."""

    register_url = '/api/v1/auth/register/'
    login_url = '/api/v1/auth/login/'
    refresh_url = '/api/v1/auth/refresh/'
    me_url = '/api/v1/auth/me/'

    def test_register_creates_user(self):
        # Регистрация создаёт пользователя и не возвращает пароль.
        response = self.client.post(
            self.register_url,
            {'username': 'alice', 'email': 'alice@example.com', 'password': 'secret12345'},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='alice').exists())
        self.assertNotIn('password', response.data)

        # Пароль сохранён в виде хеша, а не открытым текстом.
        user = User.objects.get(username='alice')
        self.assertNotEqual(user.password, 'secret12345')
        self.assertTrue(user.check_password('secret12345'))

    def test_login_returns_access_and_refresh(self):
        User.objects.create_user(username='bob', password='secret12345')
        response = self.client.post(
            self.login_url,
            {'username': 'bob', 'password': 'secret12345'},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_refresh_returns_new_access(self):
        User.objects.create_user(username='carol', password='secret12345')
        login = self.client.post(
            self.login_url,
            {'username': 'carol', 'password': 'secret12345'},
            format='json',
        )
        refresh_token = login.data['refresh']

        response = self.client.post(
            self.refresh_url,
            {'refresh': refresh_token},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    def test_me_requires_authentication(self):
        # Без токена доступ запрещён.
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_me_with_valid_token_returns_profile(self):
        User.objects.create_user(
            username='dave', email='dave@example.com', password='secret12345'
        )
        login = self.client.post(
            self.login_url,
            {'username': 'dave', 'password': 'secret12345'},
            format='json',
        )
        access_token = login.data['access']

        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + access_token)
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'dave')
        self.assertEqual(response.data['email'], 'dave@example.com')
        self.assertNotIn('password', response.data)


class UserProfileTests(APITestCase):
    """Проверяем модель и API профиля пользователя (UserProfile)."""

    register_url = '/api/v1/auth/register/'
    login_url = '/api/v1/auth/login/'
    me_url = '/api/v1/auth/me/'

    def login_as(self, username, password='secret12345'):
        """Создаём пользователя, входим и ставим Authorization-заголовок."""
        User.objects.create_user(
            username=username,
            email=f'{username}@example.com',
            password=password,
        )
        login = self.client.post(
            self.login_url,
            {'username': username, 'password': password},
            format='json',
        )
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + login.data['access'])

    def test_profile_created_automatically(self):
        # Профиль создаётся сигналом post_save сразу при создании пользователя.
        user = User.objects.create_user(username='auto', password='secret12345')
        self.assertTrue(hasattr(user, 'profile'))
        self.assertEqual(user.profile.user, user)

    def test_register_creates_profile(self):
        response = self.client.post(
            self.register_url,
            {'username': 'newbie', 'email': 'newbie@example.com', 'password': 'secret12345'},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = User.objects.get(username='newbie')
        self.assertTrue(UserProfile.objects.filter(user=user).exists())

    def test_get_me_returns_profile_fields(self):
        self.login_as('eve')
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'eve')
        self.assertEqual(response.data['email'], 'eve@example.com')
        self.assertIn('bio', response.data)
        self.assertIn('avatar_url', response.data)

    def test_patch_updates_bio_and_avatar_url(self):
        self.login_as('frank')
        response = self.client.patch(
            self.me_url,
            {'bio': 'Привет, мир', 'avatar_url': 'https://example.com/avatar.png'},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['bio'], 'Привет, мир')
        self.assertEqual(response.data['avatar_url'], 'https://example.com/avatar.png')

        profile = UserProfile.objects.get(user__username='frank')
        self.assertEqual(profile.bio, 'Привет, мир')
        self.assertEqual(profile.avatar_url, 'https://example.com/avatar.png')

    def test_patch_cannot_change_username_or_email(self):
        # username и email доступны только для чтения — изменения игнорируются.
        self.login_as('gina')
        response = self.client.patch(
            self.me_url,
            {'username': 'hacked', 'email': 'hacked@example.com', 'bio': 'ok'},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'gina')
        self.assertEqual(response.data['email'], 'gina@example.com')

        user = User.objects.get(username='gina')
        self.assertEqual(user.username, 'gina')
        self.assertEqual(user.email, 'gina@example.com')

    def test_me_requires_authentication(self):
        # Без токена и GET, и PATCH запрещены.
        self.assertEqual(
            self.client.get(self.me_url).status_code,
            status.HTTP_401_UNAUTHORIZED,
        )
        self.assertEqual(
            self.client.patch(self.me_url, {'bio': 'x'}, format='json').status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_get_me_creates_profile_if_missing(self):
        # Если профиль отсутствует, API не падает, а создаёт его.
        user = User.objects.create_user(username='lost', password='secret12345')
        UserProfile.objects.filter(user=user).delete()

        login = self.client.post(
            self.login_url,
            {'username': 'lost', 'password': 'secret12345'},
            format='json',
        )
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + login.data['access'])

        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(UserProfile.objects.filter(user=user).exists())
