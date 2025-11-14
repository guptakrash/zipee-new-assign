import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  token: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    // Check for existing token on mount
    const savedToken = localStorage.getItem('sw_token')
    if (savedToken) {
      setToken(savedToken)
      setIsAuthenticated(true)
      // Simulate token refresh
      refreshToken()
    }
  }, [])

  const refreshToken = async () => {
    // Simulate silent token refresh
    const newToken = `mock_jwt_${Date.now()}`
    localStorage.setItem('sw_token', newToken)
    setToken(newToken)
  }

  const login = async (username: string, password: string): Promise<boolean> => {
    // Mock authentication - accept any credentials
    // In real app, this would call an API
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API call
    
    const mockToken = `mock_jwt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('sw_token', mockToken)
    setToken(mockToken)
    setIsAuthenticated(true)
    return true
  }

  const logout = () => {
    localStorage.removeItem('sw_token')
    setToken(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

