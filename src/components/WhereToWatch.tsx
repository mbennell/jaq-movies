'use client'

import Image from 'next/image'

interface Provider {
  provider_id: number
  provider_name: string
  logo_path: string
}

interface WatchProvider {
  link: string
  flatrate?: Provider[]
  rent?: Provider[]
  buy?: Provider[]
}

interface WhereToWatchProps {
  watchProviders?: WatchProvider
  region?: string
}

export default function WhereToWatch({ watchProviders, region = 'US' }: WhereToWatchProps) {
  if (!watchProviders) {
    return (
      <div className="where-to-watch-section">
        <h3 className="where-to-watch-title">Where to Watch</h3>
        <div className="no-providers">
          <p style={{ color: '#9ca3af', fontSize: '0.875rem', fontStyle: 'italic' }}>
            No streaming information available
          </p>
        </div>
      </div>
    )
  }

  const { flatrate = [], rent = [], buy = [] } = watchProviders

  const renderProviderSection = (title: string, providers: Provider[]) => {
    if (providers.length === 0) return null

    return (
      <div className="provider-section">
        <h4 className="provider-section-title">{title}</h4>
        <div className="provider-icons">
          {providers.slice(0, 6).map((provider) => (
            <div key={provider.provider_id} className="provider-icon-wrapper">
              <Image
                src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                alt={provider.provider_name}
                width={40}
                height={40}
                className="provider-icon"
                title={provider.provider_name}
              />
            </div>
          ))}
          {providers.length > 6 && (
            <div className="provider-more">
              +{providers.length - 6}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="where-to-watch-section">
      <h3 className="where-to-watch-title">Where to Watch</h3>
      
      <div className="providers-container">
        {renderProviderSection('STREAM', flatrate)}
        {renderProviderSection('RENT', rent)}
        {renderProviderSection('BUY', buy)}
        
        {flatrate.length === 0 && rent.length === 0 && buy.length === 0 && (
          <div className="no-providers">
            <p style={{ color: '#9ca3af', fontSize: '0.875rem', fontStyle: 'italic' }}>
              No streaming information available for {region}
            </p>
          </div>
        )}
      </div>

      {watchProviders.link && (
        <div className="justwatch-attribution">
          <a 
            href={watchProviders.link}
            target="_blank"
            rel="noopener noreferrer"
            className="justwatch-link"
          >
            Data provided by JustWatch
          </a>
        </div>
      )}

      <style jsx>{`
        .where-to-watch-section {
          margin: var(--spacing-lg, 1.5rem) 0;
        }

        .where-to-watch-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: var(--spacing-md, 1rem);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .providers-container {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          width: 100%;
          gap: var(--spacing-lg, 1.5rem);
        }

        .provider-section {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm, 0.5rem);
          min-width: 120px;
          flex: 1 1 calc(33.333% - var(--spacing-lg, 1.5rem));
          max-width: 200px;
        }

        .provider-section-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin: 0;
        }

        .provider-icons {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-sm, 0.5rem);
          align-items: center;
        }

        .provider-icon-wrapper {
          position: relative;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .provider-icon-wrapper:hover {
          transform: scale(1.1);
        }

        .provider-icon {
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease;
        }

        .provider-icon:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }

        .provider-more {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.1);
          color: #9ca3af;
          font-size: 0.75rem;
          font-weight: 600;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .no-providers {
          padding: var(--spacing-md, 1rem);
          text-align: center;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .justwatch-attribution {
          margin-top: var(--spacing-md, 1rem);
          text-align: center;
        }

        .justwatch-link {
          color: #9ca3af;
          font-size: 0.75rem;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .justwatch-link:hover {
          color: #0066ff;
          text-decoration: underline;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .providers-container {
            flex-direction: column;
            justify-content: flex-start;
            gap: var(--spacing-md, 1rem);
          }
          
          .provider-section {
            min-width: unset;
            max-width: unset;
            flex: 1 1 auto;
          }
          
          .provider-icons {
            gap: var(--spacing-xs, 0.25rem);
          }
          
          .provider-icon {
            width: 32px;
            height: 32px;
          }
          
          .provider-more {
            width: 32px;
            height: 32px;
            font-size: 0.65rem;
          }
        }
      `}</style>
    </div>
  )
}