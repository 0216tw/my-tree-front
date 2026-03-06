import { Navigate, Outlet } from 'react-router-dom'

import { isAuthenticated } from '@/auth/storage'

function GuestOnlyRoute() {
  if (isAuthenticated()) {
    return <Navigate to="/home" replace />
  }

  return <Outlet />
}

export default GuestOnlyRoute
