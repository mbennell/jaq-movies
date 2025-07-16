'use client'

import { useState } from 'react'

interface SearchBarProps {
  onSearch?: (query: string) => void
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  className?: string
}

export default function SearchBar({ 
  onSearch, 
  placeholder = "Search movies…", 
  value = "", 
  onChange,
  className = ""
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState(value)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchQuery)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSearchQuery(newValue)
    if (onChange) {
      onChange(newValue)
    }
  }

  return (
    <div className={`search-bar-container ${className}`} style={{
      width: '100%',
      maxWidth: '80%',
      margin: '0 auto',
      padding: 'var(--spacing-2xl) 0'
    }}>
      <label style={{
        display: 'block',
        fontSize: 'var(--font-size-sm)',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        color: 'var(--text-muted)',
        marginBottom: 'var(--spacing-sm)'
      }}>
        Search Movies
      </label>
      
      <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: 'var(--spacing-lg) var(--spacing-xl)',
            fontSize: 'var(--font-size-lg)',
            fontFamily: 'var(--font-family)',
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-dark)',
            border: '1px solid var(--bg-secondary)',
            borderRadius: 'var(--border-radius-lg)',
            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
            transition: 'all var(--transition-normal)',
            outline: 'none'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--accent-primary)'
            e.target.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 0 0 3px var(--accent-glow)'
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--bg-secondary)'
            e.target.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
        />
        
        <button
          type="submit"
          style={{
            position: 'absolute',
            right: 'var(--spacing-md)',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'var(--accent-primary)',
            color: 'white',
            border: 'none',
            padding: 'var(--spacing-sm) var(--spacing-md)',
            borderRadius: 'var(--border-radius)',
            fontSize: 'var(--font-size-sm)',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--accent-hover)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--accent-primary)'
          }}
        >
          Search
        </button>
      </form>
    </div>
  )
}