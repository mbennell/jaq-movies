'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Navigation from '../../components/Navigation'

interface Movie {
  id: string | number
  title: string
  overview: string
  release_date: string
  poster_path: string
  vote_average: number
  genre_ids: number[]
  jaqNotes?: string
  enthusiasmLevel?: number
}

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const loadMovies = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/movies')
      const data = await response.json()
      
      if (data.success) {
        setMovies(data.results || [])
        setError(null)
      } else {
        setError(data.error || 'Failed to load movies')
        setMovies([])
      }
    } catch {
      setError('Network error loading movies')
      setMovies([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMovies()
  }, [])

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getEnthusiasmEmoji = (level?: number) => {
    if (!level) return '⭐'
    if (level >= 5) return '🔥'
    if (level >= 4) return '⭐⭐⭐'
    if (level >= 3) return '⭐⭐'
    return '⭐'
  }

  return (
    <div>
      <Navigation />
      
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '2rem' 
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          marginBottom: '2rem',
          textAlign: 'center',
          color: '#333'
        }}>
          🎬 Movie Collection ({movies.length})
        </h1>

        {/* Search */}
        <div style={{ marginBottom: '2rem' }}>
          <input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem',
              fontSize: '1.1rem',
              border: '2px solid #ddd',
              borderRadius: '8px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {loading && (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem',
            fontSize: '1.2rem',
            color: '#666'
          }}>
            Loading movies...
          </div>
        )}

        {error && (
          <div style={{ 
            backgroundColor: '#ffe6e6',
            border: '1px solid #ffcccc',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#cc0000', marginBottom: '0.5rem' }}>Error Loading Movies</h3>
            <p style={{ color: '#666' }}>{error}</p>
            <button 
              onClick={loadMovies}
              style={{
                backgroundColor: '#0066cc',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                marginTop: '1rem',
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && movies.length === 0 && !error && (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ color: '#666', marginBottom: '1rem' }}>No Movies Found</h3>
            <p style={{ color: '#999' }}>
              Import Jaq&apos;s collection from the <a href="/admin" style={{ color: '#0066cc' }}>Admin panel</a>
            </p>
          </div>
        )}

        {/* Movies Grid */}
        {filteredMovies.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {filteredMovies.map((movie) => (
              <div
                key={movie.id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  backgroundColor: 'white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                {/* Movie Poster */}
                <div style={{
                  height: '200px',
                  backgroundColor: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  {movie.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      fill
                      style={{
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: '3rem' }}>📽️</span>
                  )}
                </div>
                
                {/* Movie Info */}
                <div style={{ padding: '1rem' }}>
                  <h3 style={{ 
                    margin: '0 0 0.5rem 0',
                    fontSize: '1.2rem',
                    color: '#333'
                  }}>
                    {movie.title}
                  </h3>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{ color: '#666' }}>
                      {movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown'}
                    </span>
                    <span style={{ fontSize: '1.2rem' }}>
                      {getEnthusiasmEmoji(movie.enthusiasmLevel)}
                    </span>
                  </div>
                  
                  {movie.vote_average > 0 && (
                    <div style={{ 
                      marginBottom: '0.5rem',
                      fontSize: '0.9rem',
                      color: '#666'
                    }}>
                      TMDB: ⭐ {movie.vote_average.toFixed(1)}
                    </div>
                  )}
                  
                  {movie.jaqNotes && (
                    <div style={{
                      backgroundColor: '#e8f4f8',
                      padding: '0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.9rem',
                      color: '#0066cc',
                      marginBottom: '0.5rem'
                    }}>
                      💭 {movie.jaqNotes}
                    </div>
                  )}
                  
                  <p style={{ 
                    margin: '0',
                    fontSize: '0.9rem',
                    color: '#666',
                    lineHeight: '1.4'
                  }}>
                    {movie.overview.length > 150 
                      ? movie.overview.substring(0, 150) + '...'
                      : movie.overview
                    }
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}