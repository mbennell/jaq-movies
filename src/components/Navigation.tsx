import Link from 'next/link'

export default function Navigation() {
  return (
    <nav style={{ 
      backgroundColor: '#f5f5f5', 
      padding: '1rem', 
      borderBottom: '1px solid #ddd',
      marginBottom: '2rem'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        display: 'flex', 
        gap: '2rem', 
        alignItems: 'center' 
      }}>
        <Link href="/" style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold', 
          textDecoration: 'none', 
          color: '#333' 
        }}>
          🎬 Jaq&apos;s Movie Guide
        </Link>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/simple-chat" style={{ 
            textDecoration: 'none', 
            color: '#0066cc',
            padding: '0.5rem 1rem',
            border: '1px solid #0066cc',
            borderRadius: '4px'
          }}>
            AI Chat
          </Link>
          
          <Link href="/movies" style={{ 
            textDecoration: 'none', 
            color: '#0066cc',
            padding: '0.5rem 1rem',
            border: '1px solid #0066cc',
            borderRadius: '4px'
          }}>
            Browse Movies
          </Link>
          
          <Link href="/admin" style={{ 
            textDecoration: 'none', 
            color: '#666',
            padding: '0.5rem 1rem',
            border: '1px solid #666',
            borderRadius: '4px'
          }}>
            Admin
          </Link>
        </div>
      </div>
    </nav>
  )
}