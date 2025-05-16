"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"

type UserType = {
  id: string
  username: string
  email: string
  avatar?: string
  walletConnected?: boolean
  walletAddress?: string
  loginMethod?: "email" | "social" | "wallet"
  socialProvider?: string
}

interface AuthContextType {
  user: UserType | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: { username: string; password: string }) => Promise<boolean>
  socialLogin: (provider: string) => Promise<boolean>
  walletLogin: (walletName: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("everchess_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user:", error)
      }
    }
    setIsLoading(false)
  }, [])

  // Update localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("everchess_user", JSON.stringify(user))
    } else {
      localStorage.removeItem("everchess_user")
    }
  }, [user])

  // Simulated email login
  const login = async (credentials: { username: string; password: string }): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    try {
      // For demo purposes, any non-empty username/password will work
      if (credentials.username && credentials.password) {
        setUser({
          id: "user-" + Math.random().toString(36).substr(2, 9),
          username: credentials.username,
          email: `${credentials.username.toLowerCase()}@example.com`,
          loginMethod: "email",
        })
        toast({
          title: "Login successful",
          description: `Welcome back, ${credentials.username}!`,
        })
        return true
      } else {
        toast({
          title: "Login failed",
          description: "Please enter both username and password",
          variant: "destructive",
        })
        return false
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "An error occurred during login",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Simulated social login
  const socialLogin = async (provider: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    try {
      // Generate random username based on provider
      const username = `${provider}User${Math.floor(Math.random() * 1000)}`

      setUser({
        id: "social-" + Math.random().toString(36).substr(2, 9),
        username: username,
        email: `${username.toLowerCase()}@${provider.toLowerCase()}.com`,
        loginMethod: "social",
        socialProvider: provider,
      })

      toast({
        title: "Social login successful",
        description: `Logged in with ${provider}`,
      })
      return true
    } catch (error) {
      toast({
        title: "Social login failed",
        description: `Could not login with ${provider}`,
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Simulated wallet login
  const walletLogin = async (walletName: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    try {
      // Generate random wallet address
      const walletAddress =
        "0x" +
        Array(40)
          .fill(0)
          .map(() => Math.floor(Math.random() * 16).toString(16))
          .join("")

      // Generate username from wallet address
      const username = `${walletName}${walletAddress.substring(2, 6)}`

      setUser({
        id: "wallet-" + Math.random().toString(36).substr(2, 9),
        username: username,
        email: `${username.toLowerCase()}@crypto.wallet`,
        walletConnected: true,
        walletAddress: walletAddress,
        loginMethod: "wallet",
      })

      toast({
        title: "Wallet connected",
        description: `Connected to ${walletName}`,
      })
      return true
    } catch (error) {
      toast({
        title: "Wallet connection failed",
        description: `Could not connect to ${walletName}`,
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    setUser(null)
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        socialLogin,
        walletLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
