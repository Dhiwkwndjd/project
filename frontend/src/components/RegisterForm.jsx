import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

function RegisterForm() {
  const navigate = useNavigate()

  // Одно состояние для всех трёх полей формы.
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    // Не даём браузеру перезагрузить страницу.
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await api.post('auth/register/', form)
      // Успешная регистрация — отправляем пользователя на вход.
      navigate('/login/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="card">
        <h1>Регистрация</h1>

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
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
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
              autoComplete="new-password"
              required
            />
          </div>

          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Отправка...' : 'Зарегистрироваться'}
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
