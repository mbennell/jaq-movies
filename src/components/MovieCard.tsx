'use client'

import Image from 'next/image'
import { useState } from 'react'

interface MovieCardProps {
  movie: {
    id: string | number
    title: string
    overview: string
    release_date?: string
    poster_path?: string
    vote_average?: number
    jaqNotes?: string
    enthusiasmLevel?: number
  }
  onViewDetails?: (movieId: string | number) => void
}

export default function MovieCard({ movie, onViewDetails }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = () => {
    if (onViewDetails) {
      onViewDetails(movie.id)
    }
  }

  const getYear = (dateString?: string) => {
    if (!dateString) return 'Unknown'
    return new Date(dateString).getFullYear().toString()
  }

  const getEnthusiasmStars = (level?: number) => {
    if (!level) return '⭐'
    if (level >= 5) return '🔥'
    if (level >= 4) return '⭐⭐⭐'
    if (level >= 3) return '⭐⭐'
    return '⭐'
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <div 
      className="card"
      style={{
        height: '500px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        cursor: 'pointer',
        border: '3px solid red' // Temporary debug border
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Poster Section - 60% of card height */}
      <div style={{
        height: '60%',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 'var(--border-radius) var(--border-radius) 0 0',
        backgroundColor: 'var(--bg-secondary)'
      }}>
        {movie.poster_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            fill
            style={{
              objectFit: 'cover',
              transition: 'all var(--transition-normal)',
              filter: isHovered ? 'brightness(0.7)' : 'brightness(1)'
            }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-muted)'
          }}>
            <span style={{ fontSize: 'var(--font-size-4xl)' }}>🎬</span>
          </div>
        )}
        
        {/* Hover Overlay */}
        {isHovered && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all var(--transition-normal)'
          }}>
            <div style={{
              textAlign: 'center',
              color: 'white'
            }}>
              <div style={{
                fontSize: 'var(--font-size-3xl)',
                marginBottom: 'var(--spacing-sm)'
              }}>
                ▶️
              </div>
              <div style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                View Details
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Content Section - 40% of card height */}
      <div style={{
        height: '40%',
        padding: 'var(--spacing-lg)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div>
          <h3 style={{
            fontSize: 'var(--font-size-lg)',
            fontWeight: '700',
            color: 'var(--text-dark)',
            marginBottom: 'var(--spacing-xs)',
            lineHeight: '1.2'
          }}>
            {movie.title}
          </h3>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--spacing-sm)'
          }}>
            <span style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--text-muted)',
              fontWeight: '400'
            }}>
              {getYear(movie.release_date)}
            </span>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-xs)'
            }}>
              {movie.vote_average && movie.vote_average > 0 && (
                <span style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--text-muted)'
                }}>
                  ⭐ {movie.vote_average.toFixed(1)}
                </span>
              )}
              
              {movie.enthusiasmLevel && (
                <span style={{
                  fontSize: 'var(--font-size-sm)',
                  marginLeft: 'var(--spacing-xs)'
                }}>
                  {getEnthusiasmStars(movie.enthusiasmLevel)}
                </span>
              )}
            </div>
          </div>
          
          {movie.jaqNotes && (
            <div style={{
              backgroundColor: 'var(--accent-glow)',
              padding: 'var(--spacing-xs) var(--spacing-sm)',
              borderRadius: 'var(--border-radius)',
              marginBottom: 'var(--spacing-sm)'
            }}>
              <p style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--accent-primary)',
                fontWeight: '500',
                fontStyle: 'italic'
              }}>
                💭 {truncateText(movie.jaqNotes, 60)}
              </p>
            </div>
          )}
        </div>
        
        <p style={{
          fontSize: 'var(--font-size-sm)',
          color: 'var(--text-muted)',
          lineHeight: '1.4',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {movie.overview}
        </p>
      </div>
    </div>
  )
}