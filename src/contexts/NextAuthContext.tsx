'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'

interface AuthContextType {
  user: any // eslint-disable-line @typescript-eslint/no-explicit-any
  isLoading: boolean
  isAuthenticated: boolean
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUpWithEmail: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function NextAuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  
  const isLoading = status === 'loading'
  const isAuthenticated = !!session?.user

  const signInWithGoogle = async () => {
    await signIn('google', { callbackUrl: '/' })
  }

  const signInWithEmail = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.error || 'Login failed' }
      }

      // Refresh session after successful login
      window.location.href = '/'
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  const signUpWithEmail = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, confirmPassword: password }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.error || 'Registration failed' }
      }

      // Refresh session after successful registration
      window.location.href = '/'
      return { success: true }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  const logout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  const value = {
    user: session?.user || null,
    isLoading,
    isAuthenticated,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useNextAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useNextAuth must be used within a NextAuthProvider')
  }
  return context
}
