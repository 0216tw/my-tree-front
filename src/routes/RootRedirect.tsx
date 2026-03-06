import { Navigate } from 'react-router-dom'

import { isAuthenticated } from '@/auth/storage'

function RootRedirect() {
  return <Navigate to={isAuthenticated() ? '/home' : '/login'} replace />
}

export default RootRedirect
