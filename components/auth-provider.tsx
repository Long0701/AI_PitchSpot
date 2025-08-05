"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { UserRole } from "@/lib/types" // Import UserRole enum

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role?: UserRole) => Promise<void>
  logout: () => void
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("SmartSport-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, role: UserRole = UserRole.Player) => {
    // Mock login - in real app, this would call your API
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split("@")[0],
      email,
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    }

    setUser(mockUser)
    localStorage.setItem("SmartSport-user", JSON.stringify(mockUser))
  }

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    // Mock registration
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    }

    setUser(mockUser)
    localStorage.setItem("SmartSport-user", JSON.stringify(mockUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("SmartSport-user")
  }

  return <AuthContext.Provider value={{ user, login, logout, register, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
