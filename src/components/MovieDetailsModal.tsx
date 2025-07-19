'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { useUser } from '../contexts/UserContext'
import UserScoreBadge from './UserScoreBadge'
import WhereToWatch from './WhereToWatch'
import CastCarousel from './CastCarousel'

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

interface WatchProvider {
  link: string
  flatrate?: StreamingProvider[]
  rent?: StreamingProvider[]
  buy?: StreamingProvider[]
}

interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
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
  cast?: CastMember[]
  crew?: { id: number; name: string; job: string }[]
  jaqNotes?: string
  enthusiasmLevel?: number
  streaming_providers?: WatchProvider
  trailers?: Trailer[]
  similar_movies?: SimilarMovie[]
}

interface MovieDetailsModalProps {
  movie: MovieDetails | null
  isOpen: boolean
  onClose: () => void
  onSelectMovie?: (movieId: number) => void
  onMovieAdded?: () => void
}

export default function MovieDetailsModal({ movie, isOpen, onClose, onSelectMovie, onMovieAdded }: MovieDetailsModalProps) {
  const [showTrailer, setShowTrailer] = useState(false)
  const [selectedTrailer, setSelectedTrailer] = useState<Trailer | null>(null)
  const [personalRating, setPersonalRating] = useState<number>(0)
  const [isWatchlisted, setIsWatchlisted] = useState<boolean>(false)
  const [isWatched, setIsWatched] = useState<boolean>(false)
  const [addingMovies, setAddingMovies] = useState<Set<number>>(new Set())
  const [addedMovies, setAddedMovies] = useState<Set<number>>(new Set())
  const [userActionsLoading, setUserActionsLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const { userId } = useUser()
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

  const loadUserActions = useCallback(async () => {
    if (!movie || !userId) return

    try {
      setUserActionsLoading(true)
      const response = await fetch(`/api/users/${encodeURIComponent(userId)}/actions/${movie.id}`)
      const data = await response.json()

      if (data.success) {
        const userAction = data.userAction
        setPersonalRating(userAction.rating || 0)
        setIsWatchlisted(userAction.isWatchlisted || false)
        setIsWatched(userAction.isWatched || false)
      }
    } catch (error) {
      console.error('Error loading user actions:', error)
    } finally {
      setUserActionsLoading(false)
    }
  }, [movie, userId])

  // Load user actions when modal opens
  useEffect(() => {
    if (isOpen && movie && userId) {
      loadUserActions()
    } else {
      // Reset to defaults when modal closes or no user
      setPersonalRating(0)
      setIsWatchlisted(false)
      setIsWatched(false)
    }
  }, [isOpen, movie, userId, loadUserActions])

  const saveUserActions = async () => {
    if (!movie || !userId) return

    try {
      const response = await fetch(`/api/users/${encodeURIComponent(userId)}/actions/${movie.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: personalRating || null,
          isWatchlisted,
          isWatched
        }),
      })

      const data = await response.json()
      if (!data.success) {
        console.error('Failed to save user actions:', data.error)
      }
    } catch (error) {
      console.error('Error saving user actions:', error)
    }
  }

  const handleDeleteMovie = async () => {
    if (!movie) return

    try {
      setDeleting(true)
      const response = await fetch(`/api/movies/${movie.id}/delete`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        console.log(`Successfully deleted "${movie.title}"`)
        onClose() // Close modal
        onMovieAdded?.() // Refresh the movie list
        setShowDeleteConfirm(false)
      } else {
        console.error('Failed to delete movie:', data.error)
        alert('Failed to delete movie. Please try again.')
      }
    } catch (error) {
      console.error('Error deleting movie:', error)
      alert('Error deleting movie. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

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

  const handleAddToCollection = async (tmdbId: number, title: string) => {
    try {
      // Add to loading state
      setAddingMovies(prev => new Set(prev).add(tmdbId))

      const response = await fetch('/api/movies/add-from-tmdb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tmdbId }),
      })

      const data = await response.json()

      if (data.success) {
        // Add to success state
        setAddedMovies(prev => new Set(prev).add(tmdbId))
        console.log(`Successfully added "${title}" to collection`)
        // Notify parent component to refresh movie list
        onMovieAdded?.()
      } else if (data.alreadyExists) {
        // Already in collection
        setAddedMovies(prev => new Set(prev).add(tmdbId))
        console.log(`"${title}" is already in collection`)
      } else {
        console.error('Failed to add movie:', data.message)
      }
    } catch (error) {
      console.error('Error adding movie to collection:', error)
    } finally {
      // Remove from loading state
      setAddingMovies(prev => {
        const newSet = new Set(prev)
        newSet.delete(tmdbId)
        return newSet
      })
    }
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
                <div className="meta-row">
                  <span className="modal-year">{getYear(movie.release_date)}</span>
                  {movie.runtime && (
                    <>
                      <span className="modal-separator">•</span>
                      <span className="modal-runtime">{getRuntime(movie.runtime)}</span>
                    </>
                  )}
                  {movie.enthusiasmLevel && (
                    <>
                      <span className="modal-separator">•</span>
                      <span className="modal-enthusiasm">{getEnthusiasmStars(movie.enthusiasmLevel)}</span>
                    </>
                  )}
                </div>
                {movie.vote_average > 0 && (
                  <div className="score-section">
                    <UserScoreBadge score={Math.round(movie.vote_average * 10)} size={60} />
                    <div className="score-label">
                      <span className="score-text">User Score</span>
                    </div>
                  </div>
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
                        onClick={() => {
                          setPersonalRating(star)
                          setTimeout(saveUserActions, 100) // Small delay to ensure state update
                        }}
                        disabled={userActionsLoading || !userId}
                      >
                        ⭐
                      </button>
                    ))}
                    {personalRating > 0 && (
                      <button
                        className="clear-rating"
                        onClick={() => {
                          setPersonalRating(0)
                          setTimeout(saveUserActions, 100)
                        }}
                        disabled={userActionsLoading || !userId}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                <div className="status-buttons">
                  <button
                    className={`status-button ${isWatchlisted ? 'active' : ''}`}
                    onClick={() => {
                      setIsWatchlisted(!isWatchlisted)
                      setTimeout(saveUserActions, 100)
                    }}
                    disabled={userActionsLoading || !userId}
                  >
                    {isWatchlisted ? '❤️ In Watchlist' : '🤍 Add to Watchlist'}
                  </button>
                  
                  <button
                    className={`status-button ${isWatched ? 'active' : ''}`}
                    onClick={() => {
                      setIsWatched(!isWatched)
                      setTimeout(saveUserActions, 100)
                    }}
                    disabled={userActionsLoading || !userId}
                  >
                    {isWatched ? '✅ Watched' : '👁️ Mark as Watched'}
                  </button>
                </div>

                {/* Delete Movie Section */}
                <div style={{ 
                  marginTop: 'var(--spacing-xl)', 
                  paddingTop: 'var(--spacing-lg)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  {!showDeleteConfirm ? (
                    <button
                      className="status-button"
                      onClick={() => setShowDeleteConfirm(true)}
                      style={{
                        background: 'linear-gradient(135deg, var(--error) 0%, #dc2626 100%)',
                        borderColor: 'var(--error)',
                        color: 'white'
                      }}
                    >
                      🗑️ Remove from Collection
                    </button>
                  ) : (
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ 
                        color: 'var(--text-primary)', 
                        marginBottom: 'var(--spacing-md)',
                        fontSize: 'var(--font-size-sm)'
                      }}>
                        Are you sure you want to remove <strong>&quot;{movie.title}&quot;</strong> from your collection?
                      </p>
                      <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center' }}>
                        <button
                          className="status-button"
                          onClick={handleDeleteMovie}
                          disabled={deleting}
                          style={{
                            background: 'linear-gradient(135deg, var(--error) 0%, #dc2626 100%)',
                            borderColor: 'var(--error)',
                            color: 'white'
                          }}
                        >
                          {deleting ? '🗑️ Deleting...' : '✅ Yes, Delete'}
                        </button>
                        <button
                          className="status-button"
                          onClick={() => setShowDeleteConfirm(false)}
                          disabled={deleting}
                        >
                          ❌ Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-overview">
                <h3>Overview</h3>
                <p>{movie.overview}</p>
              </div>
            </div>
          </div>

          {/* Where to Watch Section */}
          <WhereToWatch watchProviders={movie.streaming_providers} />

          {/* Cast Carousel */}
          {movie.cast && movie.cast.length > 0 && (
            <CastCarousel cast={movie.cast} />
          )}


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
                      <button
                        className={`add-to-collection-btn ${
                          addedMovies.has(similarMovie.id) ? 'added' : 
                          addingMovies.has(similarMovie.id) ? 'adding' : ''
                        }`}
                        onClick={(e) => {
                          e.stopPropagation()
                          if (!addedMovies.has(similarMovie.id) && !addingMovies.has(similarMovie.id)) {
                            handleAddToCollection(similarMovie.id, similarMovie.title)
                          }
                        }}
                        disabled={addingMovies.has(similarMovie.id) || addedMovies.has(similarMovie.id)}
                      >
                        {addedMovies.has(similarMovie.id) ? '✅ Added' :
                         addingMovies.has(similarMovie.id) ? '⏳ Adding...' :
                         '➕ Add to Collection'}
                      </button>
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