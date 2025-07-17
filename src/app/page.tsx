'use client'

import { useState, useEffect } from 'react'
import Navigation from '../components/Navigation'
import Hero from '../components/Hero'
import SearchBar from '../components/SearchBar'
import MovieCard from '../components/MovieCard'
import FadeInSection from '../components/FadeInSection'
import MovieDetailsModal from '../components/MovieDetailsModal'

interface Movie {
  id: string | number
  title: string
  overview: string
  release_date: string
  poster_path: string
  vote_average: number
  jaqNotes?: string
  enthusiasmLevel?: number
}

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

export default function Home() {
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)

  useEffect(() => {
    loadFeaturedMovies()
  }, [])

  const handleSearch = (query: string) => {
    // Redirect to movies page with search query
    window.location.href = `/movies?search=${encodeURIComponent(query)}`
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
    // Refresh the featured movies when a new movie is added
    loadFeaturedMovies()
  }

  const loadFeaturedMovies = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/movies')
      const data = await response.json()
      
      if (data.success) {
        // Get 6 random movies from the collection for featured section
        const allMovies = data.results || []
        const shuffled = [...allMovies].sort(() => 0.5 - Math.random())
        const randomMovies = shuffled.slice(0, 6)
        
        setFeaturedMovies(randomMovies)
      }
    } catch (error) {
      console.error('Error loading featured movies:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Navigation isTransparent={true} />
      
      <Hero backgroundImage="/images/jaq-founder.png" />
      
      <FadeInSection delay={200}>
        <SearchBar onSearch={handleSearch} />
      </FadeInSection>
      
      {/* Featured Movies Section */}
      <section style={{
        padding: 'var(--spacing-4xl) 0',
        backgroundColor: 'var(--bg-primary)'
      }}>
        <div className="container">
          <FadeInSection delay={300}>
            <h2 style={{
              fontSize: 'var(--font-size-3xl)',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              textAlign: 'center',
              marginBottom: 'var(--spacing-xl)',
              color: 'var(--text-primary)'
            }}>
              Featured Films
            </h2>
            
            <p style={{
              fontSize: 'var(--font-size-lg)',
              textAlign: 'center',
              marginBottom: 'var(--spacing-2xl)',
              color: 'var(--text-secondary)',
              maxWidth: '600px',
              margin: '0 auto var(--spacing-2xl)'
            }}>
              Hand-picked favourites from Jaq&apos;s collection
            </p>
          </FadeInSection>
          
          {loading ? (
            <FadeInSection delay={400}>
              <div style={{
                textAlign: 'center',
                padding: 'var(--spacing-4xl)',
                color: 'var(--text-secondary)'
              }}>
                Loading featured movies...
              </div>
            </FadeInSection>
          ) : featuredMovies.length > 0 ? (
            <FadeInSection delay={500}>
              <div className="movie-grid">
                {featuredMovies.map((movie, index) => (
                  <FadeInSection key={movie.id} delay={600 + (index * 100)}>
                    <MovieCard movie={movie} onViewDetails={handleViewDetails} />
                  </FadeInSection>
                ))}
              </div>
            </FadeInSection>
          ) : (
            <FadeInSection delay={400}>
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
            </FadeInSection>
          )}
        </div>
      </section>
      
      {/* Footer */}
      <FadeInSection delay={300}>
        <footer style={{
          backgroundColor: 'var(--bg-secondary)',
          padding: 'var(--spacing-2xl) 0',
          textAlign: 'center',
          borderTop: '1px solid var(--bg-primary)'
        }}>
          <div className="container">
            <p style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--text-muted)'
            }}>
              © 2025 Jaq&apos;s Movie Guide • Terms • Privacy
            </p>
          </div>
        </footer>
      </FadeInSection>

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