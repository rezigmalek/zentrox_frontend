import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  async function signup(email, password, displayName, role = 'client') {
    // Simple validation
    if (!email || !password || !displayName) {
      throw new Error('All fields are required')
    }
    
    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]')
    if (existingUsers.find(u => u.email === email)) {
      throw new Error('User already exists')
    }
    
    // Create new user
    const newUser = {
      uid: Date.now().toString(),
      email,
      displayName,
      role,
      createdAt: new Date().toISOString(),
      projects: [],
      notifications: []
    }
    
    // Save user to localStorage
    existingUsers.push(newUser)
    localStorage.setItem('users', JSON.stringify(existingUsers))
    localStorage.setItem('currentUser', JSON.stringify(newUser))
    
    setCurrentUser(newUser)
    return newUser
  }

  async function login(email, password) {
    // Simple validation
    if (!email || !password) {
      throw new Error('Email and password are required')
    }
    
    // Find user in localStorage
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]')
    const user = existingUsers.find(u => u.email === email)
    
    if (!user) {
      throw new Error('User not found')
    }
    
    // In a real app, you'd verify the password here
    // For now, we'll just simulate successful login
    localStorage.setItem('currentUser', JSON.stringify(user))
    setCurrentUser(user)
    return user
  }

  function logout() {
    localStorage.removeItem('currentUser')
    setCurrentUser(null)
    return Promise.resolve()
  }

  async function getUserData(uid) {
    try {
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]')
      const user = existingUsers.find(u => u.uid === uid)
      return user || null
    } catch (error) {
      console.error('Error fetching user data:', error)
      return null
    }
  }

  useEffect(() => {
    // Check if user is logged in on app start
    try {
      const savedUser = localStorage.getItem('currentUser')
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser))
      }
    } catch (error) {
      console.error('Error loading saved user:', error)
    }
    setLoading(false)
  }, [])

  const value = {
    currentUser,
    signup,
    login,
    logout,
    getUserData
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
} 