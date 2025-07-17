'use client'

import { useState } from 'react'
import { useUser } from '../contexts/UserContext'

export default function UserPrompt() {
  const { userId, setUserId } = useUser()
  const [name, setName] = useState('')
  const [isOpen, setIsOpen] = useState(!userId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      setUserId(name.trim())
      setIsOpen(false)
    }
  }

  const handleChangeUser = () => {
    setName('')
    setIsOpen(true)
  }

  if (!isOpen && userId) {
    return (
      <div style={{
        position: 'fixed',
        top: 'var(--spacing-lg)',
        right: 'var(--spacing-lg)',
        zIndex: 1500,
        background: 'var(--bg-secondary)',
        padding: 'var(--spacing-sm) var(--spacing-md)',
        borderRadius: 'var(--border-radius)',
        border: '1px solid var(--accent-primary)',
        color: 'var(--text-primary)',
        fontSize: 'var(--font-size-sm)'
      }}>
        👋 Hi, {userId}! 
        <button
          onClick={handleChangeUser}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--accent-primary)',
            cursor: 'pointer',
            marginLeft: 'var(--spacing-xs)',
            fontSize: 'var(--font-size-xs)',
            textDecoration: 'underline'
          }}
        >
          Change User
        </button>
      </div>
    )
  }

  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 3000,
      backdropFilter: 'blur(5px)'
    }}>
      <div style={{
        background: 'var(--bg-card)',
        padding: 'var(--spacing-2xl)',
        borderRadius: 'var(--border-radius-lg)',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
        maxWidth: '400px',
        width: '90vw',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: 'var(--font-size-2xl)',
          fontWeight: '700',
          color: 'var(--text-dark)',
          marginBottom: 'var(--spacing-lg)'
        }}>
          Welcome to Jaq&apos;s Movie Guide! 🎬
        </h2>
        
        <p style={{
          fontSize: 'var(--font-size-base)',
          color: 'var(--text-muted)',
          marginBottom: 'var(--spacing-xl)',
          lineHeight: '1.5'
        }}>
          To personalize your experience with ratings and watchlists, what should we call you?
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name..."
            style={{
              width: '100%',
              padding: 'var(--spacing-md)',
              border: '2px solid var(--accent-primary)',
              borderRadius: 'var(--border-radius)',
              fontSize: 'var(--font-size-base)',
              marginBottom: 'var(--spacing-lg)',
              outline: 'none',
              textAlign: 'center'
            }}
            autoFocus
            required
          />
          
          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: 'var(--spacing-md)',
              fontSize: 'var(--font-size-base)',
              fontWeight: '600'
            }}
            disabled={!name.trim()}
          >
            Let&apos;s Get Started! 🚀
          </button>
        </form>

        <p style={{
          fontSize: 'var(--font-size-xs)',
          color: 'var(--text-muted)',
          marginTop: 'var(--spacing-lg)',
          lineHeight: '1.4'
        }}>
          Your name is only stored locally in your browser for your personal movie ratings and watchlist.
        </p>
      </div>
    </div>
  )
}