import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/providers/SessionProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Jaq's Best Ever Movie Guide",
  description: "Your personal AI-powered cinema companion for discovering, sharing, and discussing the world's greatest films",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html 
      lang="en"
      style={{
        margin: 0,
        padding: 0,
        height: '100%'
      }}
    >
      <body 
        className={inter.className}
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: '#0a0a0f',
          color: '#ffffff',
          overflowX: 'hidden',
          minHeight: '100vh',
          fontFamily: 'Inter, system-ui, sans-serif'
        }}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}