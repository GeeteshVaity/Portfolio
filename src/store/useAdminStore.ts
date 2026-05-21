import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AdminUser {
  id: string
  email: string
  name: string
  isAdmin: boolean
}

interface AdminStore {
  user: AdminUser | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: AdminUser | null) => void
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
          const response = await fetch(`${apiUrl}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.message || 'Login failed')
          }

          set({
            user: data.data,
            isAuthenticated: true,
          })
        } catch (error) {
          throw error
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        })
      },

      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
        })
      },
    }),
    {
      name: 'admin-store',
    }
  )
)
