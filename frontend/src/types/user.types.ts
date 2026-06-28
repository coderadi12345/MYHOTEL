export type UserRole = 'user' | 'admin'

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}
