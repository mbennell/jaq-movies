'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Navigation from '../../components/Navigation'
import SearchBar from '../../components/SearchBar'
import MovieCard from '../../components/MovieCard'
import FadeInSection from '../../components/FadeInSection'

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

function MoviesContent() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const searchParams = useSearchParams()

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
    
    // Get search query from URL if present
    const urlSearch = searchParams.get('search')
    if (urlSearch) {
      setSearchQuery(urlSearch)
    }
  }, [searchParams])

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    movie.overview.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  return (
    <div>
      <Navigation />
      
      <div style={{ 
        backgroundColor: 'var(--bg-primary)',
        minHeight: '100vh',
        paddingTop: 'var(--spacing-2xl)'
      }}>
        <div className="container">
          <h1 style={{ 
            fontSize: 'var(--font-size-4xl)',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '-0.01em',
            textAlign: 'center',
            marginBottom: 'var(--spacing-xl)',
            color: 'var(--text-primary)'
          }}>
            Movie Collection
          </h1>
          
          <p style={{
            fontSize: 'var(--font-size-lg)',
            textAlign: 'center',
            marginBottom: 'var(--spacing-2xl)',
            color: 'var(--text-secondary)'
          }}>
            {loading ? 'Loading...' : `${filteredMovies.length} of ${movies.length} movies`}
          </p>

          <SearchBar 
            onSearch={handleSearch}
            value={searchQuery}
            onChange={setSearchQuery}
          />

          {loading && (
            <div style={{ 
              textAlign: 'center', 
              padding: 'var(--spacing-4xl)',
              color: 'var(--text-secondary)'
            }}>
              <div style={{
                fontSize: 'var(--font-size-xl)',
                marginBottom: 'var(--spacing-md)'
              }}>
                Loading movies...
              </div>
            </div>
          )}

          {error && (
            <div style={{ 
              backgroundColor: 'var(--error)',
              color: 'white',
              padding: 'var(--spacing-lg)',
              borderRadius: 'var(--border-radius-lg)',
              marginBottom: 'var(--spacing-xl)',
              textAlign: 'center'
            }}>
              <h3 style={{ 
                fontSize: 'var(--font-size-xl)',
                marginBottom: 'var(--spacing-sm)'
              }}>
                Error Loading Movies
              </h3>
              <p style={{ 
                marginBottom: 'var(--spacing-md)',
                color: 'rgba(255, 255, 255, 0.9)'
              }}>
                {error}
              </p>
              <button 
                onClick={loadMovies}
                className="btn btn-primary"
                style={{
                  backgroundColor: 'white',
                  color: 'var(--error)'
                }}
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && movies.length === 0 && !error && (
            <div style={{ 
              textAlign: 'center', 
              padding: 'var(--spacing-4xl)',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--border-radius-lg)',
              color: 'var(--text-secondary)'
            }}>
              <h3 style={{ 
                fontSize: 'var(--font-size-xl)',
                marginBottom: 'var(--spacing-md)',
                color: 'var(--text-primary)'
              }}>
                No Movies Found
              </h3>
              <p>
                Import Jaq&apos;s collection from the{' '}
                <a href="/admin" style={{ color: 'var(--accent-primary)' }}>
                  Admin panel
                </a>
              </p>
            </div>
          )}

          {!loading && searchQuery && filteredMovies.length === 0 && movies.length > 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: 'var(--spacing-4xl)',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--border-radius-lg)',
              color: 'var(--text-secondary)'
            }}>
              <h3 style={{ 
                fontSize: 'var(--font-size-xl)',
                marginBottom: 'var(--spacing-md)',
                color: 'var(--text-primary)'
              }}>
                No Results Found
              </h3>
              <p>
                No movies match your search for &quot;{searchQuery}&quot;
              </p>
              <button 
                onClick={() => setSearchQuery('')}
                className="btn btn-primary"
                style={{ marginTop: 'var(--spacing-md)' }}
              >
                Clear Search
              </button>
            </div>
          )}

          {/* Movies Grid */}
          {filteredMovies.length > 0 && (
            <FadeInSection delay={200}>
              <div className="movie-grid">
                {filteredMovies.map((movie, index) => (
                  <FadeInSection key={movie.id} delay={300 + (index * 50)}>
                    <MovieCard movie={movie} />
                  </FadeInSection>
                ))}
              </div>
            </FadeInSection>
          )}
        </div>
      </div>
    </div>
  )
}

export default function MoviesPage() {
  return (
    <Suspense fallback={
      <div style={{ 
        backgroundColor: 'var(--bg-primary)', 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          color: 'var(--text-primary)',
          fontSize: 'var(--font-size-lg)'
        }}>
          Loading movies...
        </div>
      </div>
    }>
      <MoviesContent />
    </Suspense>
  )
}