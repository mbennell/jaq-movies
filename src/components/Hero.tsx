import Link from 'next/link'

interface HeroProps {
  backgroundImage?: string
  children?: React.ReactNode
  showCTA?: boolean
  ctaText?: string
  ctaLink?: string
}

export default function Hero({ 
  backgroundImage = '/images/jaq-movie-hero1.png',
  children,
  showCTA = false,
  ctaText = 'Chat with Jaq',
  ctaLink = '/simple-chat'
}: HeroProps) {
  return (
    <section 
      className="hero-section hero-background"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="hero-title" style={{ 
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '-0.02em',
          marginBottom: 'var(--spacing-lg)',
          color: 'var(--text-primary)',
          textAlign: 'center'
        }}>
          Jaq&apos;s Gonna Find<br />Your Next Movie
        </h1>
        
        <p className="hero-tagline" style={{ 
          fontWeight: '400',
          marginBottom: 'var(--spacing-2xl)',
          color: 'var(--text-secondary)',
          textAlign: 'center',
          maxWidth: '600px'
        }}>
          Where the Goode Weird Lives
        </p>

        {showCTA && (
          <div className="hero-cta">
            <Link href={ctaLink} className="cta-button">
              {ctaText}
            </Link>
          </div>
        )}

        {children && (
          <div className="hero-custom-content">
            {children}
          </div>
        )}
      </div>
    </section>
  )
}