'use client'

import { HeroUIProvider } from '@heroui/react'
import { UserProvider } from '../contexts/UserContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <UserProvider>
        {children}
      </UserProvider>
    </HeroUIProvider>
  )
}