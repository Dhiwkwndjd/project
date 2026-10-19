import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

function LoginForm() {
  const navigate = useNavigate()

  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      // SimpleJWT ожидает поля username и password.
      const { data } = await api.post('auth/login/', form)

      // Сохраняем токены, чтобы клиент подставлял их в следующие запросы.
      localStorage.setItem('access', data.access)
      localStorage.setItem('refresh', data.refresh)

      // После входа — на защищённую страницу профиля.
      navigate('/profile/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="card">
        <h1>Вход</h1>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="username">Имя пользователя</label>
            <input
              id="username"
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>

          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Отправка...' : 'Войти'}
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
