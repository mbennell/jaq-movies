'use client'

import { useState, useEffect } from 'react'
import Navigation from '../components/Navigation'
import Hero from '../components/Hero'
import SearchBar from '../components/SearchBar'
import MovieCard from '../components/MovieCard'
import FadeInSection from '../components/FadeInSection'

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

export default function Home() {
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadFeaturedMovies = async () => {
      try {
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

    loadFeaturedMovies()
  }, [])

  const handleSearch = (query: string) => {
    // Redirect to movies page with search query
    window.location.href = `/movies?search=${encodeURIComponent(query)}`
  }

  return (
    <div>
      <Navigation isTransparent={true} />
      
      <Hero />
      
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
                    <MovieCard movie={movie} />
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
    </div>
  )
}