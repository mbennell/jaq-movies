'use client'

import { useEffect } from 'react'
import Image from 'next/image'

interface StreamingProvider {
  provider_id: number
  provider_name: string
  logo_path: string
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
    flatrate?: StreamingProvider[]
    rent?: StreamingProvider[]
    buy?: StreamingProvider[]
  }
}

interface MovieDetailsModalProps {
  movie: MovieDetails | null
  isOpen: boolean
  onClose: () => void
}

export default function MovieDetailsModal({ movie, isOpen, onClose }: MovieDetailsModalProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent background scrolling
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen || !movie) return null

  const getYear = (dateString: string) => {
    return new Date(dateString).getFullYear().toString()
  }

  const getRuntime = (minutes?: number) => {
    if (!minutes) return 'Unknown'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const getEnthusiasmStars = (level?: number) => {
    if (!level) return '⭐'
    if (level >= 5) return '🔥'
    if (level >= 4) return '⭐⭐⭐'
    if (level >= 3) return '⭐⭐'
    return '⭐'
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        {/* Background Image */}
        {movie.backdrop_path && (
          <div className="modal-backdrop">
            <Image
              src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
              alt={movie.title}
              fill
              style={{ objectFit: 'cover' }}
            />
            <div className="modal-backdrop-overlay" />
          </div>
        )}

        {/* Content */}
        <div className="modal-body">
          <div className="modal-header">
            <div className="modal-poster">
              {movie.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  width={300}
                  height={450}
                  style={{
                    borderRadius: 'var(--border-radius-lg)',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
                  }}
                />
              ) : (
                <div className="modal-poster-placeholder">
                  <span>🎬</span>
                </div>
              )}
            </div>

            <div className="modal-info">
              <h1 className="modal-title">{movie.title}</h1>
              
              <div className="modal-meta">
                <span className="modal-year">{getYear(movie.release_date)}</span>
                {movie.runtime && (
                  <>
                    <span className="modal-separator">•</span>
                    <span className="modal-runtime">{getRuntime(movie.runtime)}</span>
                  </>
                )}
                {movie.vote_average > 0 && (
                  <>
                    <span className="modal-separator">•</span>
                    <span className="modal-rating">⭐ {movie.vote_average.toFixed(1)}</span>
                  </>
                )}
                {movie.enthusiasmLevel && (
                  <>
                    <span className="modal-separator">•</span>
                    <span className="modal-enthusiasm">{getEnthusiasmStars(movie.enthusiasmLevel)}</span>
                  </>
                )}
              </div>

              {movie.genres && movie.genres.length > 0 && (
                <div className="modal-genres">
                  {movie.genres.map((genre) => (
                    <span key={genre.id} className="genre-tag">
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {movie.jaqNotes && (
                <div className="jaq-notes">
                  <h3>💭 Jaq&apos;s Notes</h3>
                  <p>{movie.jaqNotes}</p>
                </div>
              )}

              <div className="modal-overview">
                <h3>Overview</h3>
                <p>{movie.overview}</p>
              </div>
            </div>
          </div>

          {/* Streaming Providers */}
          {movie.streaming_providers && (
            <div className="streaming-section">
              <h3>Where to Watch</h3>
              
              {movie.streaming_providers.flatrate && movie.streaming_providers.flatrate.length > 0 && (
                <div className="streaming-category">
                  <h4>Stream</h4>
                  <div className="provider-list">
                    {movie.streaming_providers.flatrate.map((provider) => (
                      <div key={provider.provider_id} className="provider-item">
                        <Image
                          src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`}
                          alt={provider.provider_name}
                          width={45}
                          height={45}
                          style={{ borderRadius: 'var(--border-radius)' }}
                        />
                        <span>{provider.provider_name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {movie.streaming_providers.rent && movie.streaming_providers.rent.length > 0 && (
                <div className="streaming-category">
                  <h4>Rent</h4>
                  <div className="provider-list">
                    {movie.streaming_providers.rent.map((provider) => (
                      <div key={provider.provider_id} className="provider-item">
                        <Image
                          src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`}
                          alt={provider.provider_name}
                          width={45}
                          height={45}
                          style={{ borderRadius: 'var(--border-radius)' }}
                        />
                        <span>{provider.provider_name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {movie.streaming_providers.buy && movie.streaming_providers.buy.length > 0 && (
                <div className="streaming-category">
                  <h4>Buy</h4>
                  <div className="provider-list">
                    {movie.streaming_providers.buy.map((provider) => (
                      <div key={provider.provider_id} className="provider-item">
                        <Image
                          src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`}
                          alt={provider.provider_name}
                          width={45}
                          height={45}
                          style={{ borderRadius: 'var(--border-radius)' }}
                        />
                        <span>{provider.provider_name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="justwatch-attribution">
                <p>Streaming data provided by <strong>JustWatch</strong></p>
              </div>
            </div>
          )}

          {/* Cast */}
          {movie.cast && movie.cast.length > 0 && (
            <div className="cast-section">
              <h3>Cast</h3>
              <div className="cast-list">
                {movie.cast.slice(0, 8).map((actor) => (
                  <div key={actor.id} className="cast-item">
                    {actor.profile_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                        alt={actor.name}
                        width={80}
                        height={120}
                        style={{ 
                          borderRadius: 'var(--border-radius)',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <div className="cast-placeholder">
                        <span>👤</span>
                      </div>
                    )}
                    <div className="cast-info">
                      <p className="actor-name">{actor.name}</p>
                      <p className="character-name">{actor.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}