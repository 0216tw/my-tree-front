import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { extractApiErrorMessage } from '@/apis/error'
import { signupUser } from '@/apis/users'

type SignupFormState = {
  userId: string
  password: string
  name: string
}

function SignupPage() {
  const navigate = useNavigate()
  const [formState, setFormState] = useState<SignupFormState>({
    userId: '',
    password: '',
    name: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')

    try {
      await signupUser(formState)
      navigate('/login', {
        replace: true,
        state: {
          signupSuccessMessage: '회원가입이 완료되었습니다. 로그인해 주세요.',
        },
      })
    } catch (error) {
      setErrorMessage(extractApiErrorMessage(error, '회원가입에 실패했습니다.'))
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
            autoComplete="new-password"
            required
          />
        </label>

        <label className="form-field">
          <span>이름</span>
          <input
            type="text"
            value={formState.name}
            onChange={(event) =>
              setFormState((currentState) => ({
                ...currentState,
                name: event.target.value,
              }))
            }
            placeholder="이름을 입력하세요"
            autoComplete="name"
            required
          />
        </label>

        {errorMessage ? <p className="form-message error">{errorMessage}</p> : null}

        <button type="submit" className="primary-button" disabled={isSubmitting}>
          {isSubmitting ? '가입 중...' : '회원가입'}
        </button>
      </form>

      <div className="form-footer">
        <span>이미 계정이 있으면 로그인으로 돌아갑니다.</span>
        <Link to="/login" className="secondary-button">
          로그인
        </Link>
      </div>
    </div>
  )
}

export default SignupPage
