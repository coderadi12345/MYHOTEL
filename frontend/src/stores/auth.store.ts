import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, UserRole } from '../types/user.types'

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  isAdmin: () => boolean
  isUser: () => boolean
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
      isAdmin: () => get().user?.role === 'admin',
      isUser: () => get().user?.role === 'user',
    }),
    { name: 'myhotel-auth' }
  )
)

export function hasRole(user: User | null, role: UserRole): boolean {
  return user?.role === role
}
