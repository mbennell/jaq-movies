'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface UserContextType {
  userId: string | null
  userAvatar: string | null
  setUserId: (userId: string) => void
  setUserAvatar: (avatarUrl: string | null) => void
  clearUser: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserIdState] = useState<string | null>(null)
  const [userAvatar, setUserAvatarState] = useState<string | null>(null)

  useEffect(() => {
    // Load user from localStorage on mount, or set default for proof of concept
    const storedUserId = localStorage.getItem('jaq-movie-user')
    const storedAvatar = localStorage.getItem('jaq-movie-user-avatar')
    
    if (storedUserId) {
      setUserIdState(storedUserId)
      setUserAvatarState(storedAvatar)
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

  const setUserAvatar = (avatarUrl: string | null) => {
    setUserAvatarState(avatarUrl)
    if (avatarUrl) {
      localStorage.setItem('jaq-movie-user-avatar', avatarUrl)
    } else {
      localStorage.removeItem('jaq-movie-user-avatar')
    }
  }

  const clearUser = () => {
    setUserIdState(null)
    setUserAvatarState(null)
    localStorage.removeItem('jaq-movie-user')
    localStorage.removeItem('jaq-movie-user-avatar')
  }

  return (
    <UserContext.Provider value={{ userId, userAvatar, setUserId, setUserAvatar, clearUser }}>
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