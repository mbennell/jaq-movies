'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface NavigationProps {
  isTransparent?: boolean
}

export default function Navigation({ isTransparent = false }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 50)
    }

    if (isTransparent) {
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [isTransparent])

  const navClass = isTransparent 
    ? (isScrolled ? 'nav-solid' : 'nav-transparent')
    : 'nav-solid'

  return (
    <nav 
      className={navClass}
      style={{ 
        position: isTransparent ? 'fixed' : 'static',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: 'var(--spacing-lg)',
        transition: 'all var(--transition-normal)',
        borderBottom: !isTransparent || isScrolled ? '1px solid var(--bg-secondary)' : 'none'
      }}
    >
      <div className="container" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between'
      }}>
        <Link 
          href="/" 
          style={{ 
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Image
            src="/images/logo2.png"
            alt="Jaq Deep Cuts"
            width={120}
            height={40}
            style={{
              objectFit: 'contain'
            }}
          />
        </Link>
        
        <div style={{ display: 'flex', gap: 'var(--spacing-lg)' }}>
          <Link 
            href="/simple-chat" 
            style={{ 
              textDecoration: 'none', 
              color: 'var(--text-primary)',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              borderRadius: 'var(--border-radius)',
              transition: 'all var(--transition-fast)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--accent-primary)'
              e.currentTarget.style.color = 'white'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = 'var(--text-primary)'
            }}
          >
            AI Chat
          </Link>
          
          <Link 
            href="/movies" 
            style={{ 
              textDecoration: 'none', 
              color: 'var(--text-primary)',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              borderRadius: 'var(--border-radius)',
              transition: 'all var(--transition-fast)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--accent-primary)'
              e.currentTarget.style.color = 'white'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = 'var(--text-primary)'
            }}
          >
            Browse Movies
          </Link>
          
          <Link 
            href="/admin" 
            style={{ 
              textDecoration: 'none', 
              color: 'var(--text-muted)',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              borderRadius: 'var(--border-radius)',
              transition: 'all var(--transition-fast)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'
              e.currentTarget.style.color = 'var(--text-primary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = 'var(--text-muted)'
            }}
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  )
}