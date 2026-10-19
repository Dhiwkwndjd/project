import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Проверяем, что строка — корректная ссылка http/https.
function isValidUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function ProfilePage() {
  const navigate = useNavigate()
  // user обновляется в AuthContext, поэтому изменения сразу видны здесь.
  const { user, updateProfile, logout } = useAuth()

  // Значения формы редактирования.
  // ProtectedRoute показывает страницу только когда user уже загружен,
  // поэтому начальные значения берём прямо из user.
  const [form, setForm] = useState({
    bio: user?.bio || '',
    avatar_url: user?.avatar_url || '',
  })
  const [fieldErrors, setFieldErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')
  // Стало true, если картинка аватара не смогла загрузиться.
  const [avatarFailed, setAvatarFailed] = useState(false)

  // Уведомление исчезает само через 3 секунды.
  useEffect(() => {
    if (!toast) {
      return undefined
    }
    const timer = setTimeout(() => setToast(''), 3000)
    return () => clearTimeout(timer)
  }, [toast])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    // Пользователь меняет ссылку — пробуем загрузить картинку заново.
    if (name === 'avatar_url') {
      setAvatarFailed(false)
    }
  }

  function handleLogout() {
    logout()
    navigate('/login/')
  }

  async function handleSubmit(event) {
    // Не даём браузеру перезагрузить страницу.
    event.preventDefault()
    setServerError('')
    setFieldErrors({})

    const avatarUrl = form.avatar_url.trim()

    // Если поле заполнено — это должна быть корректная ссылка.
    if (avatarUrl && !isValidUrl(avatarUrl)) {
      setFieldErrors({
        avatar_url: 'Введите корректный URL (например, https://example.com/avatar.png).',
      })
      return
    }

    setSaving(true)
    try {
      const updated = await updateProfile({ bio: form.bio, avatar_url: avatarUrl })
      // Держим форму в соответствии с ответом сервера.
      setForm({ bio: updated.bio || '', avatar_url: updated.avatar_url || '' })
      setAvatarFailed(false)
      // Уведомление показываем ТОЛЬКО после успешного ответа сервера.
      setToast('Профиль успешно обновлен')
    } catch (err) {
      setServerError(err.message || 'Не удалось сохранить изменения.')
    } finally {
      setSaving(false)
    }
  }

  // Показываем «живой» предпросмотр аватара из поля формы.
  const avatarUrl = form.avatar_url.trim()
  const showAvatarImage = avatarUrl !== '' && !avatarFailed
  const initial = (user?.username || '?').charAt(0).toUpperCase()

  return (
    <div className="page">
      {/* Всплывающее уведомление об успехе. */}
      {toast && <div className="toast">{toast}</div>}

      <div className="card">
        <h1>Профиль</h1>

        <div className="profile-header">
          {showAvatarImage ? (
            <img
              className="avatar-img"
              src={avatarUrl}
              alt={`Аватар пользователя ${user?.username || ''}`}
              onError={() => setAvatarFailed(true)}
            />
          ) : (
            // Заглушка, если аватар не задан или не загрузился.
            <div className="avatar-placeholder" aria-label="Аватар не загружен">
              {initial}
            </div>
          )}

          <div className="profile-head-info">
            <span className="profile-name">{user?.username}</span>
            <span className="profile-email">{user?.email || '—'}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="bio">О себе</label>
            <textarea
              id="bio"
              name="bio"
              rows="3"
              value={form.bio}
              onChange={handleChange}
              placeholder="Расскажите о себе"
            />
          </div>

          <div className="form-field">
            <label htmlFor="avatar_url">Ссылка на аватар</label>
            <input
              id="avatar_url"
              name="avatar_url"
              type="text"
              value={form.avatar_url}
              onChange={handleChange}
              placeholder="https://example.com/avatar.png"
              className={fieldErrors.avatar_url ? 'input-error' : ''}
            />
            {fieldErrors.avatar_url && (
              <span className="field-error">{fieldErrors.avatar_url}</span>
            )}
          </div>

          {serverError && <p className="error">{serverError}</p>}

          <button className="btn" type="submit" disabled={saving}>
            {saving ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
        </form>

        <div className="profile-actions">
          <button className="btn btn-secondary" type="button" onClick={handleLogout}>
            Выйти
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
