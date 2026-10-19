from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import RegisterView, UserProfileView

urlpatterns = [
    # POST /api/v1/auth/register/ — регистрация
    path('register/', RegisterView.as_view(), name='register'),
    # POST /api/v1/auth/login/ — получение access и refresh токенов
    path('login/', TokenObtainPairView.as_view(), name='login'),
    # POST /api/v1/auth/refresh/ — обновление access токена
    path('refresh/', TokenRefreshView.as_view(), name='refresh'),
    # GET /api/v1/auth/me/ — профиль текущего пользователя
    path('me/', UserProfileView.as_view(), name='me'),
]
