'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useUser } from '../contexts/UserContext'

interface NavigationProps {
  isTransparent?: boolean
}

export default function Navigation({ isTransparent = false }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [avatarError, setAvatarError] = useState(false)
  const { userId, userAvatar } = useUser()

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav 
        className={`${navClass} desktop-nav`}
        style={{ 
          position: isTransparent ? 'fixed' : 'static',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: 'var(--header-height)',
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
              src="/img/logo-jaq-movie.png"
              alt="Jaq Deep Cuts"
              width={420}
              height={140}
              className="nav-logo"
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
              className="nav-item-admin"
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

      {/* Mobile Header */}
      <header className="mobile-header">
        <button className="nav-avatar" aria-label="User menu">
          <div className="avatar-circle">
            {userAvatar && !avatarError ? (
              <Image
                src={userAvatar}
                alt={userId || 'User'}
                width={32}
                height={32}
                className="avatar-image"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <span className="avatar-initials">
                {userId ? userId.charAt(0).toUpperCase() : 'U'}
              </span>
            )}
          </div>
        </button>
        <Link href="/">
          <img src="/img/logo-jaq-movie.png" alt="Jaq Deep Cuts" className="site-logo" />
        </Link>
        <button 
          className="hamburger" 
          aria-label="Menu" 
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          onClick={toggleMobileMenu}
        >
          ☰
        </button>
      </header>

      {/* Mobile Menu */}
      <nav id="mobile-menu" className="mobile-menu" hidden={!isMobileMenuOpen}>
        <div className="greeting-pill">
          👋 Hi, {userId || 'User'}! <button onClick={() => {}}>Change User</button>
        </div>
        <div className="mobile-menu-links">
          <Link href="/simple-chat" onClick={() => setIsMobileMenuOpen(false)}>
            AI Chat
          </Link>
          <Link href="/movies" onClick={() => setIsMobileMenuOpen(false)}>
            Browse Movies
          </Link>
          <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
            Admin
          </Link>
        </div>
      </nav>
    </>
  )
}