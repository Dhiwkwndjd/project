# 02. ЭТАП 1 — структура монорепозитория

## 🧑 Пользователь

```
Выполни техническое задание по созданию монорепозитория, используя терминал и OpenCode.

Структура проекта:

my-fullstack-app/
├── .gitignore
├── AGENTS.md
├── backend/    # Django REST API
└── frontend/   # React + Vite

1. Создай указанную структуру в текущей директории. Сначала проверь, где находишься, и не создавай лишнюю вложенную папку, если текущая директория уже является корнем проекта.

2. Backend:
- Создай папку backend.
- Создай виртуальное окружение Python в backend/venv.
- Установи django, djangorestframework, djangorestframework-simplejwt и django-cors-headers.
- Создай Django-проект с названием config.
- Создай приложение authentication.

3. Frontend:
- Создай React-проект через Vite в папке frontend.
- Установи axios и react-router-dom.
- Проверь, что проект запускается.

4. Создай .gitignore в корне проекта и добавь:
.env
venv/
backend/venv/
node_modules/
dist/
__pycache__/
*.pyc
db.sqlite3

5. Создай AGENTS.md с инструкциями для OpenCode:
- Пиши простой код, понятный начинающему.
- Перед изменением изучай существующие файлы.
- Не переписывай рабочий код без необходимости.
- Проверяй работоспособность после изменений.
- Не добавляй секреты и виртуальные окружения в Git.
- Используй понятные сообщения коммитов на русском языке.

6. Используй OpenCode для выполнения всех действий. Не устанавливай и не запускай Aider. Не создавай файл .aider.conf.yml.

7. Не выполняй git init, не подключай удалённый репозиторий, не создавай коммиты и не делай git push. Git настрою отдельно.

8. Выполняй команды самостоятельно, последовательно проверяя результаты. Если обнаружишь ошибку, попробуй исправить её.

9. В конце покажи итоговую структуру проекта, установленные библиотеки, результаты проверок и команды запуска backend и frontend.

Не ограничивайся инструкциями и примерами кода. Реально создай файлы и выполни необходимые команды через терминал.
```

## 🤖 Агент (OpenCode)

Все задачи выполнены.

**Структура создана прямо в текущей директории** `C:\Users\danil\Desktop\срс`
(без лишней вложенной `my-fullstack-app/`, так как это уже корень проекта — здесь есть `.git` и `README.md`).

### Итоговая структура

```
срс/
├── .gitignore
├── AGENTS.md
├── README.md              # осталось с прошлой задачи
├── backend/
│   ├── venv/              # (игнорируется Git)
│   ├── manage.py
│   ├── db.sqlite3         # (игнорируется Git)
│   ├── config/            # Django-проект
│   │   ├── __init__.py
│   │   ├── asgi.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   └── authentication/    # приложение
│       ├── migrations/
│       ├── __init__.py
│       ├── admin.py
│       ├── apps.py
│       ├── models.py
│       ├── tests.py
│       └── views.py
└── frontend/              # React + Vite
    ├── public/
    ├── src/
    ├── index.html
    ├── package.json
    ├── package-lock.json
    ├── vite.config.js
    └── .gitignore
```

### Установленные библиотеки

**Backend** (`pip freeze`):

```
asgiref==3.12.1
Django==6.1.2
django-cors-headers==4.9.0
djangorestframework==3.18.3
djangorestframework_simplejwt==5.5.1
PyJWT==2.15.1
sqlparse==0.6.0
tzdata==2026.5
```

**Frontend** (dependencies по ТЗ):

```
axios ^1.20.0
react ^19.2.8
react-dom ^19.2.8
react-router-dom ^7.18.4
```

Дополнительно я прописал в `backend/config/settings.py` минимальную рабочую конфигурацию, чтобы
установленные библиотеки реально использовались: `rest_framework`, `corsheaders`, `authentication`
в `INSTALLED_APPS`, `CorsMiddleware`, `REST_FRAMEWORK` с JWT-аутентификацией и `CORS_ALLOWED_ORIGINS`
для `localhost:5173`.

### Результаты проверок

| Проверка | Команда | Результат |
|---|---|---|
| Django | `python manage.py check` | ✅ `no issues` |
| Миграции | `python manage.py migrate` | ✅ применены |
| Frontend сборка | `npm run build` | ✅ `built in 218ms` |
| Dev-сервер | `npm run dev` + запрос | ✅ `HTTP 200` на `http://localhost:5173` |
| .gitignore | `git check-ignore ...` | ✅ venv, node_modules, dist, db.sqlite3, `__pycache__` игнорируются |

Проверка `git status --untracked-files=all` (31 файл) — ни одного файла из `venv/`, `node_modules/`,
`db.sqlite3`, `__pycache__` в список не попало.

### Команды запуска

**Backend** (терминал в папке `backend`):

```powershell
.\venv\Scripts\Activate.ps1          # активация venv (Windows)
python manage.py runserver           # http://127.0.0.1:8000
```

**Frontend** (терминал в папке `frontend`):

```powershell
npm run dev                          # http://localhost:5173
```

### Замечания

- В PowerShell `npm` блокируется политикой выполнения скриптов (`.ps1`), поэтому использовал `npm.cmd`.
- Git-операции (init/remote/commit/push) **не выполнял** — как и требовалось.
- Aider не устанавливал, `.aider.conf.yml` не создавал.
