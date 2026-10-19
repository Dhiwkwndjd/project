# 03. ЭТАП 2 — JWT-аутентификация (backend)

## 🧑 Пользователь

```
Выполни ЭТАП 2: Backend, модуль JWT-аутентификации в текущем проекте.

Работай через терминал и редактируй реальные файлы проекта. Используй OpenCode, не Aider. Пиши простой код, понятный начинающему разработчику. Перед изменениями изучи существующие файлы и не удаляй рабочий код без необходимости.

## 1. Настройка settings.py

Файл: backend/config/settings.py

Добавь в INSTALLED_APPS следующие приложения:

'rest_framework',
'corsheaders',
'authentication',

Проверь, что django.contrib и остальные стандартные приложения сохранены.

Добавь 'corsheaders.middleware.CorsMiddleware' в MIDDLEWARE перед CommonMiddleware.

В конец файла добавь настройки REST Framework:

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}

Настрой CORS для локальной разработки React:

CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
]

Не удаляй существующие настройки Django.

## 2. Создание сериализатора регистрации

Файл: backend/authentication/serializers.py

Создай RegisterSerializer на основе serializers.ModelSerializer.

Поля:
- id
- username
- email
- password

Требования:
- password должен иметь write_only=True.
- Пароль должен сохраняться через create_user() или set_password(), чтобы в базе хранился хеш, а не обычный пароль.
- username и email должны проходить стандартную проверку Django.
- Не возвращай пароль в ответе API.

Используй стандартную модель пользователя Django, если проект не настроен на собственную модель.

## 3. Создание представлений

Файл: backend/authentication/views.py

Создай RegisterView:
- Используй generics.CreateAPIView.
- Подключи RegisterSerializer.
- Разреши регистрацию без авторизации через AllowAny.

Создай UserProfileView:
- Используй generics.RetrieveAPIView.
- Укажи permission_classes = [IsAuthenticated].
- Возвращай данные текущего пользователя, используя request.user.
- Используй безопасный сериализатор, который не возвращает пароль.

Импорты и код должны быть корректными.

## 4. Создание URL-маршрутов

Файл: backend/authentication/urls.py

Создай следующие маршруты:

- POST /api/v1/auth/register/ — регистрация.
- POST /api/v1/auth/login/ — получение access и refresh токенов через TokenObtainPairView.
- POST /api/v1/auth/refresh/ — обновление access токена через TokenRefreshView.
- GET /api/v1/auth/me/ — профиль текущего пользователя.

Используй соответствующие классы из rest_framework_simplejwt.views.

Затем открой backend/config/urls.py и подключи маршруты authentication через include(), чтобы все четыре эндпоинта работали по указанным адресам.

Не создавай дублирующиеся маршруты.

## 5. Проверка зависимостей и базы данных

Убедись, что установлены:
- django
- djangorestframework
- djangorestframework-simplejwt
- django-cors-headers

Используй виртуальное окружение backend/venv, если оно уже создано.

Выполни из корня проекта команду миграций:

python backend/manage.py migrate

Если команда не работает из-за отсутствующих миграций приложения, сначала создай необходимые миграции, затем выполни migrate.

## 6. Проверка результата

Выполни проверку Django:

python backend/manage.py check

Исправь обнаруженные ошибки.

Проверь, что:
- регистрация создаёт пользователя;
- вход возвращает access и refresh;
- refresh принимает refresh-токен и выдаёт новый access;
- запрос /api/v1/auth/me/ без токена запрещён;
- запрос /api/v1/auth/me/ с действительным access-токеном возвращает профиль.

Если возможно, используй тесты Django REST Framework APIClient для проверки этих сценариев. Не ограничивайся проверкой синтаксиса.

## 7. Ограничения

- Не выполняй git init.
- Не создавай коммиты.
- Не выполняй git push.
- Не устанавливай Aider.
- Не переписывай frontend на этом этапе.
- Не усложняй код ненужными абстракциями.

Сначала изучи файлы, затем последовательно внеси изменения, выполни миграции и проверки. В конце сообщи, какие файлы изменены, какие команды выполнены и какие проверки прошли. Не утверждай, что тест пройден, если ты его фактически не запускал.
```

## 🤖 Агент (OpenCode)

Готово — ЭТАП 2 выполнен.

### Какие файлы изменены/созданы

| Файл | Что сделано |
|---|---|
| `backend/config/settings.py` | `rest_framework`, `corsheaders`, `authentication` в `INSTALLED_APPS` уже были (этап 1); `CorsMiddleware` перед `CommonMiddleware`; в конце — `REST_FRAMEWORK` с `JWTAuthentication` (приведён к виду-списку из ТЗ) и `CORS_ALLOWED_ORIGINS`. Стандартные `django.contrib.*` сохранены. |
| `backend/config/urls.py` | Добавлен `include('authentication.urls')` по пути `api/v1/auth/`. |
| `backend/authentication/serializers.py` | **новый**: `RegisterSerializer` (`ModelSerializer`, поле `password = CharField(write_only=True)`, сохранение через `User.objects.create_user()` → хеш) и `UserSerializer` (безопасный профиль без пароля). |
| `backend/authentication/views.py` | **переписан**: `RegisterView` (`generics.CreateAPIView`, `AllowAny`) и `UserProfileView` (`generics.RetrieveAPIView`, `IsAuthenticated`, возвращает `request.user`). |
| `backend/authentication/urls.py` | **новый**: `register/`, `login/` (`TokenObtainPairView`), `refresh/` (`TokenRefreshView`), `me/`. |
| `backend/authentication/tests.py` | **новый**: 5 тестов на `APITestCase`. |

### Выполненные команды

```powershell
backend/venv/Scripts/python.exe -m pip list --format=freeze | Select-String "Django|djangorestframework|cors"
backend/venv/Scripts/python.exe backend/manage.py migrate
backend/venv/Scripts/python.exe backend/manage.py check
backend/venv/Scripts/python.exe backend/manage.py makemigrations --check --dry-run
backend/venv/Scripts/python.exe backend/manage.py test authentication -v 2
```

### Результаты проверок

- **Зависимости**: установлены `Django==6.1.2`, `djangorestframework==3.18.3`, `djangorestframework_simplejwt==5.5.1`, `django-cors-headers==4.9.0`.
- **migrate**: `No migrations to apply` (у приложения `authentication` нет моделей — используется стандартная `django.contrib.auth.User`).
- **makemigrations --check**: `No changes detected`.
- **check**: `System check identified no issues (0 silenced).`
- **Тесты (`manage.py test authentication`): 5/5 OK**
  1. `test_register_creates_user` — регистрация создаёт пользователя, ответ без `password`, в БД хранится хеш.
  2. `test_login_returns_access_and_refresh` — вход возвращает `access` и `refresh`.
  3. `test_refresh_returns_new_access` — refresh выдаёт новый `access`.
  4. `test_me_requires_authentication` — `/me/` без токена → **401**.
  5. `test_me_with_valid_token_returns_profile` — `/me/` с валидным access → **200**, профиль без пароля.

### Итоговые эндпоинты

```
POST /api/v1/auth/register/   — регистрация
POST /api/v1/auth/login/      — access + refresh
POST /api/v1/auth/refresh/    — новый access
GET  /api/v1/auth/me/         — профиль (нужен Bearer-токен)
```

### Ограничения соблюдены

`git init` не выполнял, коммитов/push не делал, Aider не устанавливал, frontend не трогал, лишних абстракций не добавлял.
