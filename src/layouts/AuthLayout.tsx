import { Outlet } from 'react-router-dom'

function AuthLayout() {
  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-card-head">
          <p className="auth-eyebrow">my-tree</p>
          <h1 className="auth-title">간단한 로그인으로 시작합니다.</h1>
          <p className="auth-copy">
            회원가입 후 로그인하면 홈 화면으로 이동합니다.
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout
