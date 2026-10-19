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
