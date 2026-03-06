import { http } from '@/apis/http'

export type LoginRequest = {
  userId: string
  password: string
}

export type LoginResponse = {
  userId: string
  name: string
  authenticated: boolean
}

export type SignupRequest = {
  userId: string
  password: string
  name: string
}

export type SignupResponse = {
  userId: string
  name: string
  createdAt: string
  ipAddress: string
}

export async function loginUser(request: LoginRequest) {
  const response = await http.post<LoginResponse>('/users/login', request)
  return response.data
}

export async function signupUser(request: SignupRequest) {
  const response = await http.post<SignupResponse>('/users/signup', request)
  return response.data
}
