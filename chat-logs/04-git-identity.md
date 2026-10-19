# 04. Настройка данных Git и исправление автора первого коммита

## 🧑 Пользователь

```
Установи мои данные для гит, а не делай коммиты от других людей
```

## 🤖 Агент (OpenCode)

Твоя глобальная настройка Git уже была:
- `user.name = Dhiwkwndjd`
- `user.email = danillavrentev274@gmail.com`

Первый коммит показывал `danil <danil@users.noreply.github.com>` только потому, что я передал
разовый `-c` при создании коммита. Я явно закрепил твои данные и в этом репозитории:

```powershell
git config --local user.name "Dhiwkwndjd"
git config --local user.email "danillavrentev274@gmail.com"
```

Готово. Данные для Git установлены:
- **Локально в этом репозитории** (`--local`): `Dhiwkwndjd` / `danillavrentev274@gmail.com`
- **Глобально** у тебя уже были эти же значения.

Отдельный момент: самый первый коммит `8b1d388 Initial commit` **уже закоммичен и запушен**
со старым автором. Настройка конфига задним числом его не меняет.

Хочешь, я исправлю автора у этого коммита? Это делается так:

```powershell
git commit --amend --reset-author --no-edit
git push --force-with-lease origin main
```

Учти: `--force-with-lease` перезапишет историю ветки `main` на GitHub.

---

## 🧑 Пользователь

```
сделай
```

## 🤖 Агент (OpenCode)

Готово. Автор коммита исправлен и запушен.

**Что сделано:**

```powershell
git commit --amend --reset-author --no-edit
git push --force-with-lease origin main
```

**Результат:**
- Коммит: `b7ef1d5` (было `8b1d388`)
- Автор и коммиттер: `Dhiwkwndjd <danillavrentev274@gmail.com>` ✅
- Удалённая ветка `main` обновлена: `+ 8b1d388...b7ef1d5 main -> main (forced update)`
- `git ls-remote origin refs/heads/main` подтверждает, что на GitHub теперь `b7ef1d5`

Локальная и удалённая ветки синхронизированы.
