import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function LoginForm() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState({ username: '', password: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Проверяем обязательные поля.
  function validate(values) {
    const next = {}
    if (!values.username.trim()) {
      next.username = 'Введите имя пользователя.'
    }
    if (!values.password) {
      next.password = 'Введите пароль.'
    }
    return next
  }

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleBlur() {
    // Показываем ошибки поля сразу после того, как ушли из него.
    setErrors(validate(form))
  }

  const isFormFilled = form.username.trim() !== '' && form.password !== ''

  async function handleSubmit(event) {
    // Не даём браузеру перезагрузить страницу.
    event.preventDefault()
    setServerError('')

    const validationErrors = validate(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      return
    }

    setSubmitting(true)
    try {
      // SimpleJWT ожидает поля username и password.
      await login(form.username, form.password)
      navigate('/profile/')
    } catch (err) {
      setServerError(err.message || 'Не удалось войти. Проверьте данные.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page">
      <div className="card">
        <h1>Вход</h1>

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
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="current-password"
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <button
            className="btn"
            type="submit"
            disabled={submitting || !isFormFilled}
          >
            {submitting ? 'Загрузка...' : 'Войти'}
          </button>
        </form>

        <p className="form-footer">
          Нет аккаунта? <Link to="/register/">Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  )
}

export default LoginForm
