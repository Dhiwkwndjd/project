# 10. Блок 4 — Backend-рефакторинг (UserProfile, JWT/CORS, API /me/)

> Задание было озаглавлено «БЛОК 1: Backend рефакторинг Django REST Framework»,
> но по порядку это четвёртый коммит/блок в истории проекта.

## 🧑 Пользователь

```
Выполни БЛОК 1: Backend рефакторинг Django REST Framework.

Работай с существующим проектом. Перед изменениями изучи текущие модели, сериализаторы, представления и настройки. Не переписывай рабочий код без необходимости. Пиши просто и понятно.

## Задача 1.1. Модель профиля пользователя

Файл: backend/authentication/models.py

Создай модель UserProfile, связанную со стандартной моделью пользователя Django через OneToOneField.

Добавь поля:
- user — OneToOneField на модель пользователя, on_delete=models.CASCADE, related_name='profile'.
- bio — TextField, blank=True.
- avatar_url — URLField, blank=True.
- created_at — DateTimeField(auto_now_add=True).

Добавь сигнал post_save, который автоматически создаёт UserProfile при создании нового пользователя. Не создавай повторный профиль, если он уже существует.

Используй стандартную модель пользователя Django, если проект уже не настроен на собственную модель. Не меняй AUTH_USER_MODEL без необходимости.

Проверь, что модель UserProfile зарегистрирована в административной панели.

Файл: backend/authentication/admin.py

Зарегистрируй UserProfile в Django Admin. Если регистрация уже существует, не дублируй её.

## Задача 1.2. Безопасность и CORS

Файл: backend/config/settings.py

1. Удали CORS_ALLOW_ALL_ORIGINS = True, если эта настройка присутствует.
2. Настрой разрешённые источники:

CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
]

3. Проверь, что corsheaders присутствует в INSTALLED_APPS.
4. Проверь, что CorsMiddleware расположен перед CommonMiddleware.
5. Настрой SimpleJWT:

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
}

Импортируй timedelta из datetime, если он ещё не импортирован.

Сохрани остальные настройки проекта.

## Задача 1.3. Расширение API профиля

Файл: backend/authentication/serializers.py

Создай UserProfileSerializer.

Он должен возвращать:
- username — имя пользователя;
- email — электронную почту;
- bio — описание профиля;
- avatar_url — ссылку на аватар.

Данные username и email получай из связанного объекта user. Поля bio и avatar_url получай из модели UserProfile.

Настрой сериализатор так, чтобы пользователь мог изменять только bio и avatar_url. Поля username и email должны быть доступны только для чтения через этот API.

Если в файле уже есть RegisterSerializer или другие сериализаторы, сохрани их.

Файл: backend/authentication/views.py

Обнови UserProfileView так, чтобы он поддерживал:

- GET /api/v1/auth/me/ — получение профиля текущего пользователя.
- PATCH /api/v1/auth/me/ — частичное изменение bio и avatar_url текущего пользователя.

Требования:
- Используй permission_classes = [IsAuthenticated].
- Работай только с профилем пользователя из request.user.
- Не позволяй изменять профиль другого пользователя через переданный ID.
- Для PATCH используй partial=True.
- Возвращай обновлённые данные после успешного изменения.
- Если профиля по какой-либо причине нет, безопасно обработай ситуацию и не допускай ошибки сервера.

Не ломай существующую регистрацию и JWT-аутентификацию.

## Задача 1.4. Миграции и проверка

После изменения моделей:

1. Создай миграции:
python backend/manage.py makemigrations authentication
2. Примени миграции:
python backend/manage.py migrate
Если в проекте используется виртуальное окружение backend/venv, выполняй команды через его Python.
3. Проверь конфигурацию:
python backend/manage.py check
4. Проверь, что:
- UserProfile автоматически создаётся при регистрации нового пользователя.
- GET /api/v1/auth/me/ возвращает username, email, bio и avatar_url.
- PATCH /api/v1/auth/me/ обновляет только bio и avatar_url.
- Запрос без JWT-токена отклоняется.
- Существующая регистрация и вход продолжают работать.

Если возможно, создай или обнови автоматические тесты для этих сценариев и запусти их.

## Ограничения

- Не создавай новую Django-модель пользователя без необходимости.
- Не меняй существующие URL без необходимости.
- Не удаляй существующие сериализаторы и представления.
- Не выполняй git init, git commit или git push.
- Не устанавливай Aider.
- Не ограничивайся объяснениями: внеси изменения в файлы и выполни проверки.

В конце перечисли изменённые файлы, результаты миграций и проверки. Не утверждай, что проверка прошла, если она не была выполнена.
```

## 🤖 Агент (OpenCode)

Готово — БЛОК 1 выполнен.

### Изменённые/созданные файлы

| Файл | Что сделано |
|---|---|
| `backend/authentication/models.py` | **Задача 1.1**: модель `UserProfile` (OneToOneField на `User`, `related_name='profile'`, поля `bio`, `avatar_url`, `created_at`) и сигнал `post_save` с `get_or_create()`, создающий профиль при создании пользователя (без дублей). `AUTH_USER_MODEL` не менял. |
| `backend/authentication/admin.py` | `UserProfile` зарегистрирован через `@admin.register` (файл был пустой). |
| `backend/config/settings.py` | **Задача 1.2**: добавлен `from datetime import timedelta` и `SIMPLE_JWT` (access 15 мин, refresh 1 день). `CORS_ALLOWED_ORIGINS` уже был настроен на 5173; `CORS_ALLOW_ALL_ORIGINS` отсутствовал. `corsheaders` в `INSTALLED_APPS` ✓, `CorsMiddleware` перед `CommonMiddleware` ✓. |
| `backend/authentication/serializers.py` | **Задача 1.3**: добавлен `UserProfileSerializer` (`username`/`email` — read-only через `source='user.*'`; `bio`/`avatar_url` — редактируемые). `RegisterSerializer` и `UserSerializer` сохранены. |
| `backend/authentication/views.py` | `UserProfileView` теперь `RetrieveUpdateAPIView` (GET + PATCH, `http_method_names=['get','patch','head','options']`), `IsAuthenticated`. `get_object()` всегда берёт профиль из `request.user` и через `get_or_create` безопасно обрабатывает отсутствие профиля. Регистрация и JWT не тронуты. |
| `backend/authentication/tests.py` | **Задача 1.4**: добавлен класс `UserProfileTests` (7 тестов). Существующие 5 тестов сохранены. |
| `backend/authentication/migrations/0001_initial.py` | **новый** — миграция модели `UserProfile`. |

### Миграции

```
makemigrations authentication → 0001_initial.py (+ Create model UserProfile)
migrate → Applying authentication.0001_initial... OK
```

### Проверки (все реально выполнены)

| Проверка | Команда | Результат |
|---|---|---|
| Конфигурация | `python backend/manage.py check` | ✅ `no issues` |
| Нет невыполненных миграций | `makemigrations --check --dry-run` | ✅ `No changes detected` |
| Автотесты | `test authentication -v 2` | ✅ **12 тестов, OK** (5 старых + 7 новых) |

Дополнительно — живая проверка по HTTP (Django-сервер + реальные запросы):
- `register` → 201; `login` → 200 (access+refresh)
- `GET /me/` → 200, `{username, email, bio:"", avatar_url:""}`, `Access-Control-Allow-Origin: http://localhost:5173`
- `PATCH /me/` → 200, `bio`/`avatar_url` обновлены
- `PATCH` с `username: "hacked"` → 200, username не изменился
- `GET`/`PATCH` без токена → 401

---

## 🧑 Пользователь

```
добавь изменение в логи,  сделай коммит как блок 4, запушь на гитхаб
```

## 🤖 Агент (OpenCode)

Добавил этот лог, обновил оглавление `chat-logs/README.md`, закоммитил изменения
под сообщением «Блок 4: …» и запушил ветку `main` на GitHub.
