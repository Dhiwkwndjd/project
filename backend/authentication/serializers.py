from django.contrib.auth.models import User
from rest_framework import serializers

from .models import UserProfile


class RegisterSerializer(serializers.ModelSerializer):
    """Сериализатор для регистрации нового пользователя.

    Пароль принимается только на вход (write_only=True) и сохраняется
    в виде хеша через create_user(), поэтому в ответе API он не возвращается.
    """

    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        # create_user() сам хеширует пароль перед сохранением в базу.
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    """Безопасный сериализатор профиля: возвращает данные без пароля."""

    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class UserProfileSerializer(serializers.ModelSerializer):
    """Профиль пользователя для API /api/v1/auth/me/.

    username и email берутся из связанного user и доступны только для чтения.
    Изменять через этот API можно только bio и avatar_url.
    """

    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = UserProfile
        fields = ['username', 'email', 'bio', 'avatar_url']
