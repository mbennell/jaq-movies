'use client'

import { useEffect, useState } from 'react'

interface ScrollIndicatorProps {
  targetId?: string
  className?: string
}

export default function ScrollIndicator({ targetId, className = '' }: ScrollIndicatorProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      // Hide the indicator after user scrolls down 300px
      if (window.scrollY > 300) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleClick = () => {
    if (targetId) {
      const element = document.getElementById(targetId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      // Default scroll behavior - scroll down one viewport height
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      })
    }
  }

  if (!isVisible) return null

  return (
    <div 
      className={`scroll-indicator ${className}`}
      onClick={handleClick}
      style={{
        position: 'fixed',
        bottom: 'var(--spacing-2xl)',
        left: '50%',
        transform: 'translateX(-50%)',
        cursor: 'pointer',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--spacing-sm)',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity var(--transition-normal)',
        animation: 'scrollBounce 2s ease-in-out infinite'
      }}
    >
      <div style={{
        color: 'var(--text-primary)',
        fontSize: 'var(--font-size-sm)',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: 'var(--spacing-xs)',
        textAlign: 'center'
      }}>
        Scroll to see movies
      </div>
      
      <div style={{
        width: '24px',
        height: '24px',
        border: '2px solid var(--accent-primary)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 102, 255, 0.1)',
        transition: 'all var(--transition-normal)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--accent-primary)'
        e.currentTarget.style.transform = 'scale(1.1)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(0, 102, 255, 0.1)'
        e.currentTarget.style.transform = 'scale(1)'
      }}
      >
        <svg 
          width="12" 
          height="12" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="var(--accent-primary)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6,9 12,15 18,9"></polyline>
        </svg>
      </div>
    </div>
  )
}