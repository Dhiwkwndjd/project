from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


class UserProfile(models.Model):
    """Дополнительные данные профиля пользователя.

    Связан со стандартной моделью пользователя Django через OneToOneField.
    """

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profile',
    )
    bio = models.TextField(blank=True)
    avatar_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Профиль {self.user.username}'


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """Автоматически создаём профиль при создании нового пользователя.

    get_or_create() не даёт создать повторный профиль, если он уже существует.
    """
    if created:
        UserProfile.objects.get_or_create(user=instance)
