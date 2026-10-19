# AGENTS.md

Инструкции для OpenCode при работе с этим репозиторием.

## Правила работы

- Пиши простой код, понятный начинающему.
- Перед изменением изучай существующие файлы.
- Не переписывай рабочий код без необходимости.
- Проверяй работоспособность после изменений.
- Не добавляй секреты и виртуальные окружения в Git.
- Используй понятные сообщения коммитов на русском языке.

## Структура проекта

- `backend/` — Django REST API (проект `config`, приложение `authentication`).
- `frontend/` — React + Vite.

## Полезные команды

Backend:

```bash
cd backend
venv/Scripts/activate        # Windows
# source venv/bin/activate   # Linux/macOS
python manage.py runserver
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Проверки (тесты, сборка, линт)

Backend-тесты (12 тестов приложения `authentication`):

```bash
# Вариант 1: из папки backend (рекомендуется)
cd backend
venv/Scripts/python.exe manage.py test

# Вариант 2: из корня репозитория — обязательно указывать приложение,
# иначе Django найдёт 0 тестов (поиск идёт от текущего каталога).
backend/venv/Scripts/python.exe backend/manage.py test authentication
```

Frontend:

```bash
cd frontend
npm run build
npm run lint
```
