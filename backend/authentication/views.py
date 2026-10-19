from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated

from .models import UserProfile
from .serializers import RegisterSerializer, UserProfileSerializer


class RegisterView(generics.CreateAPIView):
    """Регистрация нового пользователя. Доступна без авторизации."""

    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class UserProfileView(generics.RetrieveUpdateAPIView):
    """Профиль текущего пользователя. Только для авторизованных.

    GET   /api/v1/auth/me/ — получить профиль.
    PATCH /api/v1/auth/me/ — изменить bio и avatar_url.
    """

    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    # Разрешаем только чтение и частичное изменение.
    http_method_names = ['get', 'patch', 'head', 'options']

    def get_object(self):
        # Всегда работаем с профилем текущего пользователя, а не с ID из URL,
        # поэтому изменить чужой профиль через запрос нельзя.
        # get_or_create() безопасно создаст профиль, если его вдруг нет.
        profile, _ = UserProfile.objects.get_or_create(user=self.request.user)
        return profile
