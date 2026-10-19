# 15. Финальный блок — инструкции по запуску проекта

> Запись инструкций по локальному запуску backend (Django) и frontend (React/Vite).

## 🧑 Пользователь

`
на русском напиги как запустить проект
`

## 🤖 Агент (OpenCode)

Даны пошаговые инструкции по запуску в двух терминалах:

### Окно 1 — Backend (Django)
`powershell
cd backend
.\venv\Scripts\Activate.ps1
python manage.py migrate
python manage.py runserver
`
или без активации: .\venv\Scripts\python.exe manage.py runserver

### Окно 2 — Frontend (React + Vite)
`powershell
cd frontend
npm.cmd run dev
`

Адреса: backend http://localhost:8000, frontend http://localhost:5173.

Пояснения: порядок запуска, CORS, админка, остановка Ctrl+C.

---

## 🧑 Пользователь

`
<system-reminder>
You are NO LONGER in Plan mode. ...
</system-reminder>
всё запиши в логи остатки, сделай последний коммит и запушь финальную версию на гит
`

## 🤖 Агент (OpenCode)

Добавлены финальные инструкции запуска, обновлено оглавление логов, сделан коммит
и пуш финальной версии в main.
