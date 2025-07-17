'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Navigation from '../../components/Navigation'
import SearchBar from '../../components/SearchBar'
import MovieCard from '../../components/MovieCard'
import Hero from '../../components/Hero'
import ScrollIndicator from '../../components/ScrollIndicator'
import MovieDetailsModal from '../../components/MovieDetailsModal'

interface MovieDetails {
  id: string | number
  title: string
  overview: string
  release_date: string
  poster_path: string
  backdrop_path?: string
  vote_average: number
  runtime?: number
  genres?: { id: number; name: string }[]
  cast?: { id: number; name: string; character: string; profile_path?: string }[]
  crew?: { id: number; name: string; job: string }[]
  jaqNotes?: string
  enthusiasmLevel?: number
  streaming_providers?: {
    flatrate?: { provider_id: number; provider_name: string; logo_path: string }[]
    rent?: { provider_id: number; provider_name: string; logo_path: string }[]
    buy?: { provider_id: number; provider_name: string; logo_path: string }[]
  }
  trailers?: { id: string; key: string; name: string; site: string; type: string }[]
  similar_movies?: { id: number; title: string; poster_path?: string; vote_average: number; release_date: string }[]
}

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
  const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)
  const searchParams = useSearchParams()

  const loadMovies = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/movies')
      const data = await response.json()
      
      console.log('Movies API response:', data)
      console.log('Movies count:', data.results?.length || 0)
      
      if (data.success) {
        setMovies(data.results || [])
        setError(null)
        console.log('Movies loaded successfully:', data.results?.length || 0)
      } else {
        setError(data.error || 'Failed to load movies')
        setMovies([])
        console.error('API returned error:', data.error)
      }
    } catch (err) {
      setError('Network error loading movies')
      setMovies([])
      console.error('Network error:', err)
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

  const handleViewDetails = async (movieId: string | number) => {
    try {
      setModalLoading(true)
      setIsModalOpen(true)
      
      const response = await fetch(`/api/movies/${movieId}/details`)
      const data = await response.json()
      
      if (data.success) {
        setSelectedMovie(data.movie)
      } else {
        console.error('Failed to load movie details:', data.error)
        setIsModalOpen(false)
      }
    } catch (error) {
      console.error('Error loading movie details:', error)
      setIsModalOpen(false)
    } finally {
      setModalLoading(false)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedMovie(null)
  }

  const handleSelectSimilarMovie = async (movieId: number) => {
    // Close current modal and open new one with the selected similar movie
    await handleViewDetails(movieId)
  }

  const handleMovieAdded = () => {
    // Refresh the movies list when a new movie is added
    loadMovies()
  }

  return (
    <div>
      <Navigation isTransparent={true} />
      
      <div style={{ height: '60vh', position: 'relative' }}>
        <Hero />
      </div>
      
      <div 
        id="movies-section"
        style={{ 
          backgroundColor: 'var(--bg-primary)',
          minHeight: '100vh',
          paddingTop: 'var(--spacing-2xl)'
        }}
      >
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

          {/* Debug info - remove after fixing */}
          {!loading && (
            <div style={{
              background: 'var(--bg-secondary)',
              padding: 'var(--spacing-md)',
              borderRadius: 'var(--border-radius)',
              marginBottom: 'var(--spacing-lg)',
              color: 'var(--text-primary)',
              fontSize: 'var(--font-size-sm)'
            }}>
              <strong>Debug Info:</strong><br/>
              Total movies loaded: {movies.length}<br/>
              Filtered movies: {filteredMovies.length}<br/>
              Search query: &quot;{searchQuery}&quot;<br/>
              {movies.length > 0 && (
                <>
                  First movie: {movies[0]?.title || 'N/A'}<br/>
                  Sample movie IDs: {movies.slice(0, 3).map(m => m.id).join(', ')}
                </>
              )}
            </div>
          )}

          {!loading && movies.length > 0 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center',
              marginBottom: 'var(--spacing-2xl)'
            }}>
              <ScrollIndicator targetId="movies-grid" />
            </div>
          )}

          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center',
            gap: 'var(--spacing-lg)',
            marginBottom: 'var(--spacing-xl)',
            flexWrap: 'wrap'
          }}>
            <SearchBar 
              onSearch={handleSearch}
              value={searchQuery}
              onChange={setSearchQuery}
            />
            <button 
              onClick={loadMovies}
              className="btn btn-primary"
              style={{
                padding: 'var(--spacing-sm) var(--spacing-lg)',
                fontSize: 'var(--font-size-sm)',
                whiteSpace: 'nowrap'
              }}
              disabled={loading}
            >
              {loading ? '🔄 Refreshing...' : '🔄 Refresh'}
            </button>
          </div>

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
                No movies match your search for &ldquo;{searchQuery}&rdquo;
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
            <div id="movies-grid" className="movie-grid">
              {filteredMovies.map((movie) => (
                <div key={movie.id} style={{ opacity: 1 }}>
                  <MovieCard movie={movie} onViewDetails={handleViewDetails} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Movie Details Modal */}
      <MovieDetailsModal
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSelectMovie={handleSelectSimilarMovie}
        onMovieAdded={handleMovieAdded}
      />
      
      {/* Loading overlay for modal */}
      {modalLoading && isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2500,
          color: 'var(--text-primary)',
          fontSize: 'var(--font-size-xl)'
        }}>
          Loading movie details...
        </div>
      )}
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