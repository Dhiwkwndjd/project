from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase


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
