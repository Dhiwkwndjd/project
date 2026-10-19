import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Простая проверка формата email.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function RegisterForm() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function validate(values) {
    const next = {}

    if (!values.username.trim()) {
      next.username = 'Введите имя пользователя.'
    }

    if (!values.email.trim()) {
      next.email = 'Введите email.'
    } else if (!EMAIL_RE.test(values.email.trim())) {
      next.email = 'Введите корректный email.'
    }

    if (!values.password) {
      next.password = 'Введите пароль.'
    } else if (values.password.length < 8) {
      next.password = 'Пароль должен содержать не менее 8 символов.'
    }

    return next
  }

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleBlur() {
    setErrors(validate(form))
  }

  const isFormFilled =
    form.username.trim() !== '' && form.email.trim() !== '' && form.password !== ''

  // Достаём из ответа сервера ошибку конкретного поля (например, username).
  function serverFieldError(err, field) {
    const data = err.data
    if (!data || typeof data !== 'object') {
      return ''
    }
    const value = data[field]
    if (!value) {
      return ''
    }
    const text = Array.isArray(value) ? value[0] : String(value)

    // Делаем типичные ошибки понятнее.
    if (/already exists/i.test(text)) {
      return field === 'username'
        ? 'Такое имя пользователя уже занято.'
        : 'Такая электронная почта уже занята.'
    }
    return text
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setServerError('')

    const validationErrors = validate(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      return
    }

    setSubmitting(true)
    try {
      await register({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      })
      // Успешная регистрация — отправляем пользователя на вход.
      navigate('/login/')
    } catch (err) {
      const usernameError = serverFieldError(err, 'username')
      const emailError = serverFieldError(err, 'email')
      const passwordError = serverFieldError(err, 'password')

      if (usernameError || emailError || passwordError) {
        setErrors({
          username: usernameError,
          email: emailError,
          password: passwordError,
        })
      } else {
        setServerError(err.message || 'Не удалось зарегистрироваться.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page">
      <div className="card">
        <h1>Регистрация</h1>

        {serverError && <p className="error">{serverError}</p>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="username">Имя пользователя</label>
            <input
              id="username"
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="username"
              className={errors.username ? 'input-error' : ''}
            />
            {errors.username && <span className="field-error">{errors.username}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="email"
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="new-password"
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <button
            className="btn"
            type="submit"
            disabled={submitting || !isFormFilled}
          >
            {submitting ? 'Загрузка...' : 'Зарегистрироваться'}
          </button>
        </form>

        <p className="form-footer">
          Уже есть аккаунт? <Link to="/login/">Войти</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterForm
