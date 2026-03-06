import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <main className="not-found-page">
      <div className="not-found-card">
        <p className="auth-eyebrow">404</p>
        <h2>페이지를 찾을 수 없습니다.</h2>
        <p className="not-found-copy">입력한 주소를 확인하거나 로그인 화면으로 돌아가세요.</p>
        <Link to="/" className="primary-button">
          처음으로 이동
        </Link>
      </div>
    </main>
  )
}

export default NotFoundPage
