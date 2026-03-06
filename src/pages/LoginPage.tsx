import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { extractApiErrorMessage } from '@/apis/error'
import { loginUser } from '@/apis/users'
import { setStoredAuthUser } from '@/auth/storage'

type LoginFormState = {
  userId: string
  password: string
}

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [formState, setFormState] = useState<LoginFormState>({
    userId: '',
    password: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const successMessage =
    typeof location.state === 'object' &&
    location.state !== null &&
    'signupSuccessMessage' in location.state &&
    typeof location.state.signupSuccessMessage === 'string'
      ? location.state.signupSuccessMessage
      : ''

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const response = await loginUser(formState)
      setStoredAuthUser({
        userId: response.userId,
        name: response.name,
      })
      navigate('/home', { replace: true })
    } catch (error) {
      setErrorMessage(extractApiErrorMessage(error, '로그인에 실패했습니다.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="form-section">
      <form className="form-grid" onSubmit={handleSubmit}>
        <label className="form-field">
          <span>아이디</span>
          <input
            type="text"
            value={formState.userId}
            onChange={(event) =>
              setFormState((currentState) => ({
                ...currentState,
                userId: event.target.value,
              }))
            }
            placeholder="아이디를 입력하세요"
            autoComplete="username"
            required
          />
        </label>

        <label className="form-field">
          <span>패스워드</span>
          <input
            type="password"
            value={formState.password}
            onChange={(event) =>
              setFormState((currentState) => ({
                ...currentState,
                password: event.target.value,
              }))
            }
            placeholder="패스워드를 입력하세요"
            autoComplete="current-password"
            required
          />
        </label>

        {successMessage ? <p className="form-message success">{successMessage}</p> : null}
        {errorMessage ? <p className="form-message error">{errorMessage}</p> : null}

        <button type="submit" className="primary-button" disabled={isSubmitting}>
          {isSubmitting ? '로그인 중...' : '로그인'}
        </button>
      </form>

      <div className="form-footer">
        <span>계정이 없으면 회원가입으로 이동합니다.</span>
        <Link to="/signup" className="secondary-button">
          회원가입
        </Link>
      </div>
    </div>
  )
}

export default LoginPage
