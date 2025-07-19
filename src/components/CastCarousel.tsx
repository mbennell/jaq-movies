'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

interface CastCarouselProps {
  cast: CastMember[]
  maxItems?: number
}

export default function CastCarousel({ cast, maxItems = 20 }: CastCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const displayCast = cast.slice(0, maxItems)

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300
      const newScrollLeft = direction === 'left' 
        ? scrollRef.current.scrollLeft - scrollAmount
        : scrollRef.current.scrollLeft + scrollAmount
      
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      })
      
      // Update button states after scroll animation
      setTimeout(checkScrollButtons, 300)
    }
  }

  if (displayCast.length === 0) {
    return (
      <div className="cast-carousel-section">
        <h3 className="cast-carousel-title">Cast</h3>
        <div className="no-cast">
          <p style={{ color: '#9ca3af', fontSize: '0.875rem', fontStyle: 'italic' }}>
            No cast information available
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="cast-carousel-section">
      <div className="cast-carousel-header">
        <h3 className="cast-carousel-title">Cast</h3>
        <div className="carousel-controls">
          <button
            className={`carousel-btn carousel-btn-left ${!canScrollLeft ? 'disabled' : ''}`}
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            aria-label="Scroll cast left"
          >
            ←
          </button>
          <button
            className={`carousel-btn carousel-btn-right ${!canScrollRight ? 'disabled' : ''}`}
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            aria-label="Scroll cast right"
          >
            →
          </button>
        </div>
      </div>

      <div className="cast-carousel-container">
        <div 
          ref={scrollRef}
          className="cast-carousel"
          onScroll={checkScrollButtons}
        >
          {displayCast.map((actor) => (
            <div key={actor.id} className="cast-card">
              <div className="cast-image-container">
                {actor.profile_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                    alt={actor.name}
                    width={120}
                    height={180}
                    className="cast-image"
                  />
                ) : (
                  <div className="cast-image-placeholder">
                    <span className="cast-image-icon">👤</span>
                  </div>
                )}
              </div>
              <div className="cast-info">
                <h4 className="cast-name">{actor.name}</h4>
                <p className="cast-character">{actor.character}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .cast-carousel-section {
          margin: var(--spacing-lg, 1.5rem) 0;
        }

        .cast-carousel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-md, 1rem);
        }

        .cast-carousel-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #fff;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .carousel-controls {
          display: flex;
          gap: var(--spacing-xs, 0.25rem);
        }

        .carousel-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.3);
          background: rgba(0, 0, 0, 0.6);
          color: #fff;
          cursor: pointer;
          transition: all 0.2s ease;
          backdrop-filter: blur(10px);
          font-size: 1rem;
          font-weight: bold;
        }

        .carousel-btn:hover:not(.disabled) {
          background: rgba(0, 102, 255, 0.8);
          border-color: #0066ff;
          transform: scale(1.05);
        }

        .carousel-btn.disabled {
          opacity: 0.3;
          cursor: not-allowed;
          transform: none;
        }

        .cast-carousel-container {
          position: relative;
        }

        .cast-carousel {
          display: flex;
          gap: var(--spacing-md, 1rem);
          overflow-x: auto;
          scroll-behavior: smooth;
          padding-bottom: var(--spacing-sm, 0.5rem);
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
        }

        .cast-carousel::-webkit-scrollbar {
          height: 6px;
        }

        .cast-carousel::-webkit-scrollbar-track {
          background: transparent;
        }

        .cast-carousel::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }

        .cast-carousel::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }

        .cast-card {
          flex: 0 0 120px;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .cast-card:hover {
          transform: translateY(-4px);
        }

        .cast-image-container {
          position: relative;
          width: 120px;
          height: 180px;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          transition: box-shadow 0.2s ease;
        }

        .cast-card:hover .cast-image-container {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        }

        .cast-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .cast-image-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #333 0%, #555 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
        }

        .cast-image-icon {
          font-size: 2rem;
        }

        .cast-info {
          padding: var(--spacing-sm, 0.5rem) 0;
          text-align: center;
        }

        .cast-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: #fff;
          margin: 0 0 var(--spacing-xs, 0.25rem) 0;
          line-height: 1.2;
        }

        .cast-character {
          font-size: 0.75rem;
          color: #9ca3af;
          margin: 0;
          line-height: 1.2;
        }

        .no-cast {
          padding: var(--spacing-md, 1rem);
          text-align: center;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .cast-card {
            flex: 0 0 100px;
          }

          .cast-image-container {
            width: 100px;
            height: 150px;
          }

          .cast-name {
            font-size: 0.75rem;
          }

          .cast-character {
            font-size: 0.65rem;
          }

          .carousel-controls {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}