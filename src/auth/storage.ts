export type AuthUser = {
  userId: string
  name: string
}

const AUTH_STORAGE_KEY = 'my-tree.auth-user'

export function getStoredAuthUser(): AuthUser | null {
  const rawValue = window.localStorage.getItem(AUTH_STORAGE_KEY)
  if (!rawValue) {
    return null
  }

  try {
    const parsedValue = JSON.parse(rawValue) as Partial<AuthUser>
    if (
      typeof parsedValue.userId !== 'string' ||
      typeof parsedValue.name !== 'string'
    ) {
      return null
    }

    return {
      userId: parsedValue.userId,
      name: parsedValue.name,
    }
  } catch {
    return null
  }
}

export function setStoredAuthUser(user: AuthUser) {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
}

export function clearStoredAuthUser() {
  window.localStorage.removeItem(AUTH_STORAGE_KEY)
}

export function isAuthenticated() {
  return getStoredAuthUser() !== null
}
