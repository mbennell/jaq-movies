import Link from 'next/link'

interface HeroProps {
  backgroundImage?: string
}

export default function Hero({ backgroundImage = '/images/jaq-movie-hero1.png' }: HeroProps) {
  return (
    <section 
      className="hero-section"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 style={{ 
          fontSize: 'var(--font-size-6xl)',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '-0.02em',
          marginBottom: 'var(--spacing-lg)',
          color: 'var(--text-primary)',
          textAlign: 'center'
        }}>
          Find Your Next<br />Favourite Film
        </h1>
        
        <p style={{ 
          fontSize: 'var(--font-size-xl)',
          fontWeight: '400',
          marginBottom: 'var(--spacing-2xl)',
          color: 'var(--text-secondary)',
          textAlign: 'center',
          maxWidth: '600px'
        }}>
          Chat with Jaq to get tailored movie picks
        </p>
        
        <Link 
          href="/simple-chat" 
          className="btn btn-primary"
          style={{
            fontSize: 'var(--font-size-lg)',
            padding: 'var(--spacing-lg) var(--spacing-2xl)',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
        >
          Start Chatting
        </Link>
      </div>
    </section>
  )
}