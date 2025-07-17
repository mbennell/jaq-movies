'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface StreamingProvider {
  provider_id: number
  provider_name: string
  logo_path: string
}

interface Trailer {
  id: string
  key: string
  name: string
  site: string
  type: string
}

interface SimilarMovie {
  id: number
  title: string
  poster_path?: string
  vote_average: number
  release_date: string
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
  trailers?: Trailer[]
  similar_movies?: SimilarMovie[]
}

interface MovieDetailsModalProps {
  movie: MovieDetails | null
  isOpen: boolean
  onClose: () => void
  onSelectMovie?: (movieId: number) => void
}

export default function MovieDetailsModal({ movie, isOpen, onClose, onSelectMovie }: MovieDetailsModalProps) {
  const [showTrailer, setShowTrailer] = useState(false)
  const [selectedTrailer, setSelectedTrailer] = useState<Trailer | null>(null)
  const [personalRating, setPersonalRating] = useState<number>(0)
  const [isWatchlisted, setIsWatchlisted] = useState<boolean>(false)
  const [isWatched, setIsWatched] = useState<boolean>(false)
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

              {/* Personal Actions */}
              <div className="personal-actions">
                <h3>Your Rating & Status</h3>
                
                <div className="rating-section">
                  <h4>Your Rating</h4>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        className={`star-button ${star <= personalRating ? 'active' : ''}`}
                        onClick={() => setPersonalRating(star)}
                      >
                        ⭐
                      </button>
                    ))}
                    {personalRating > 0 && (
                      <button
                        className="clear-rating"
                        onClick={() => setPersonalRating(0)}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                <div className="status-buttons">
                  <button
                    className={`status-button ${isWatchlisted ? 'active' : ''}`}
                    onClick={() => setIsWatchlisted(!isWatchlisted)}
                  >
                    {isWatchlisted ? '❤️ In Watchlist' : '🤍 Add to Watchlist'}
                  </button>
                  
                  <button
                    className={`status-button ${isWatched ? 'active' : ''}`}
                    onClick={() => setIsWatched(!isWatched)}
                  >
                    {isWatched ? '✅ Watched' : '👁️ Mark as Watched'}
                  </button>
                </div>
              </div>

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

          {/* Debug Info - Remove this later */}
          <div style={{ 
            background: '#222', 
            padding: '10px', 
            borderRadius: '5px', 
            marginBottom: '20px',
            fontSize: '12px',
            color: '#ccc'
          }}>
            <strong>Debug Info:</strong><br/>
            Trailers: {movie.trailers?.length || 0}<br/>
            Similar Movies: {movie.similar_movies?.length || 0}<br/>
            Movie ID: {movie.id}<br/>
            {movie.trailers?.length > 0 && (
              <div>First trailer: {movie.trailers[0].name}</div>
            )}
          </div>

          {/* Trailers */}
          {movie.trailers && movie.trailers.length > 0 && (
            <div className="trailers-section">
              <h3>Trailers</h3>
              <div className="trailer-buttons">
                {movie.trailers.map((trailer) => (
                  <button
                    key={trailer.id}
                    className="trailer-button"
                    onClick={() => {
                      setSelectedTrailer(trailer)
                      setShowTrailer(true)
                    }}
                  >
                    ▶️ {trailer.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Similar Movies */}
          {movie.similar_movies && movie.similar_movies.length > 0 && (
            <div className="similar-movies-section">
              <h3>Movies Like This</h3>
              <div className="similar-movies-grid">
                {movie.similar_movies.map((similarMovie) => (
                  <div
                    key={similarMovie.id}
                    className="similar-movie-card"
                    onClick={() => onSelectMovie && onSelectMovie(similarMovie.id)}
                  >
                    {similarMovie.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w300${similarMovie.poster_path}`}
                        alt={similarMovie.title}
                        width={150}
                        height={225}
                        style={{
                          borderRadius: 'var(--border-radius)',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <div className="similar-movie-placeholder">
                        <span>🎬</span>
                      </div>
                    )}
                    <div className="similar-movie-info">
                      <h4>{similarMovie.title}</h4>
                      <div className="similar-movie-meta">
                        <span>⭐ {similarMovie.vote_average.toFixed(1)}</span>
                        <span>{new Date(similarMovie.release_date).getFullYear()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && selectedTrailer && (
        <div className="trailer-overlay" onClick={() => setShowTrailer(false)}>
          <div className="trailer-modal" onClick={(e) => e.stopPropagation()}>
            <button 
              className="trailer-close"
              onClick={() => setShowTrailer(false)}
              aria-label="Close trailer"
            >
              ✕
            </button>
            <div className="trailer-container">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${selectedTrailer.key}?autoplay=1&rel=0`}
                title={selectedTrailer.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}