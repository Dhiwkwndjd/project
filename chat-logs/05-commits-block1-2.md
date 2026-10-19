# 05. Коммиты по блокам 1 и 2 + push

## 🧑 Пользователь

```
сделай коммиты по 1 и 2 блоку задания которые ты выполнил
```

## 🤖 Агент (OpenCode)

Готово. Сделал два отдельных коммита — по одному на каждый блок задания.

```
5add368  Блок 2: JWT-аутентификация (регистрация, вход, refresh, профиль пользователя)
89ef903  Блок 1: создание структуры монорепозитория (backend Django + frontend React/Vite)
b7ef1d5  Initial commit
```

**Коммит 1 — «Блок 1»** (31 файл): структура монорепозитория `.gitignore`, `AGENTS.md`,
`backend/` (Django-проект `config` + приложение `authentication`, settings с подключёнными
библиотеками) и `frontend/` (React + Vite).

**Коммит 2 — «Блок 2»** (5 файлов):
- `backend/authentication/serializers.py` (новый)
- `backend/authentication/urls.py` (новый)
- `backend/authentication/views.py` (доработан)
- `backend/authentication/tests.py` (добавлены тесты)
- `backend/config/urls.py` (подключён `include('authentication.urls')`)

Автор обоих коммитов — `Dhiwkwndjd <danillavrentev274@gmail.com>`.

**Проверки после коммитов:**
- `git status` — рабочее дерево чистое;
- `python backend/manage.py test authentication` — 5 тестов, ошибок нет (exit 0).

Как я разделял: чтобы «Блок 1» не содержал код второго этапа, я временно вернул `views.py`,
`tests.py` и `config/urls.py` к их состоянию после первого этапа, закоммитил структуру, затем
вернул финальные версии и закоммитил второй блок. Настройки `settings.py` целиком попали
в первый коммит — там они и были добавлены.

Ветка `main` — `ahead 2` коммита от `origin/main`. **Пуш не делал** — ты просил только коммиты.

---

## 🧑 Пользователь

```
запуш конечно
```

## 🤖 Агент (OpenCode)

Запушено. ✅

```
b7ef1d5..5add368  main -> main
```

- Локальный `HEAD` и `origin/main` совпадают: `5add368`
- Статус: `## main...origin/main` (всё синхронизировано)
- Автор обоих коммитов — `Dhiwkwndjd <danillavrentev274@gmail.com>`

На GitHub теперь три коммита: `Initial commit` → `Блок 1` → `Блок 2`.
