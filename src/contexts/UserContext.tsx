'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface UserContextType {
  userId: string | null
  setUserId: (userId: string) => void
  clearUser: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserIdState] = useState<string | null>(null)

  useEffect(() => {
    // Load user from localStorage on mount, or set default for proof of concept
    const storedUserId = localStorage.getItem('jaq-movie-user')
    if (storedUserId) {
      setUserIdState(storedUserId)
    } else {
      // Set default user for proof of concept (until OAuth login is implemented)
      const defaultUser = 'Demo User'
      setUserIdState(defaultUser)
      localStorage.setItem('jaq-movie-user', defaultUser)
    }
  }, [])

  const setUserId = (newUserId: string) => {
    const cleanUserId = newUserId.trim()
    if (cleanUserId) {
      setUserIdState(cleanUserId)
      localStorage.setItem('jaq-movie-user', cleanUserId)
    }
  }

  const clearUser = () => {
    setUserIdState(null)
    localStorage.removeItem('jaq-movie-user')
  }

  return (
    <UserContext.Provider value={{ userId, setUserId, clearUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}