import { Outlet, useNavigate } from 'react-router-dom'

import { clearStoredAuthUser, getStoredAuthUser } from '@/auth/storage'

function AppLayout() {
  const navigate = useNavigate()
  const authUser = getStoredAuthUser()

  const handleLogout = () => {
    clearStoredAuthUser()
    navigate('/login', { replace: true })
  }

  return (
    <div className="home-shell">
      <header className="home-header">
        <div className="home-brand">
          <p className="home-eyebrow">my-tree</p>
          <h1>Home</h1>
        </div>

        <div className="home-header-actions">
          {authUser ? <p className="home-user">{authUser.userId}</p> : null}
          <button type="button" className="secondary-button header-button" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </header>

      <main className="home-main">
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
