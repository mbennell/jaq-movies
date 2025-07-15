import Navigation from '../components/Navigation'
import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <Navigation />
      
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '2rem',
        textAlign: 'center' 
      }}>
        <h1 style={{ 
          fontSize: '3rem', 
          marginBottom: '1rem',
          color: '#333'
        }}>
          🎬 Jaq&apos;s Movie Guide
        </h1>
        
        <p style={{ 
          fontSize: '1.2rem', 
          marginBottom: '3rem', 
          color: '#666',
          lineHeight: '1.6'
        }}>
          Get personalized movie recommendations from Jaq&apos;s curated collection. 
          Chat with our AI assistant or browse the complete library.
        </p>
        
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '3rem'
        }}>
          <Link href="/simple-chat" style={{
            backgroundColor: '#0066cc',
            color: 'white',
            padding: '1rem 2rem',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: 'bold'
          }}>
            💬 Start AI Chat
          </Link>
          
          <Link href="/movies" style={{
            backgroundColor: '#28a745',
            color: 'white',
            padding: '1rem 2rem',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: 'bold'
          }}>
            📚 Browse Movies
          </Link>
        </div>
        
        <div style={{ 
          backgroundColor: '#f8f9fa',
          padding: '2rem',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            marginBottom: '1rem',
            color: '#333'
          }}>
            What You Can Do:
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            textAlign: 'left'
          }}>
            <div>
              <h3 style={{ color: '#0066cc', marginBottom: '0.5rem' }}>🤖 AI Chat</h3>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>
                Ask for recommendations like &quot;I want something sci-fi&quot; or &quot;recommend a good thriller&quot;
              </p>
            </div>
            
            <div>
              <h3 style={{ color: '#28a745', marginBottom: '0.5rem' }}>📱 Browse</h3>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>
                Explore Jaq&apos;s complete collection with ratings and personal notes
              </p>
            </div>
            
            <div>
              <h3 style={{ color: '#ffc107', marginBottom: '0.5rem' }}>⭐ Ratings</h3>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>
                See TMDB ratings and Jaq&apos;s personal enthusiasm levels for each movie
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}