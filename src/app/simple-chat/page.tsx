'use client'

import { useState } from 'react'
import Navigation from '../../components/Navigation'
import Hero from '../../components/Hero'

interface ChatMessage {
  type: 'user' | 'ai'
  content: string
  timestamp: Date
}

interface Movie {
  id: string
  title: string
  posterPath?: string
  rating?: number
}

interface Recommendation {
  id: string
  recommendedBy: string
  jaqNotes?: string
  enthusiasmLevel: number
  movie: Movie
}

export default function SimpleChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      type: 'ai',
      content: "Hi! I'm here to help with movie recommendations. You can tell me what you just watched, or ask me what you should watch next! 🎬",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      type: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Try OpenAI assistant first, fallback to simple chat if it fails
      let response = await fetch('/api/assistant/simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: input
        }),
      })
      
      let data = await response.json()
      
      // If OpenAI fails, try fallback
      if (!response.ok || data.status === 'error') {
        console.log('OpenAI failed, trying fallback chat...', data.error || 'Unknown error')
        response = await fetch('/api/chat-fallback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            message: input
          }),
        })
        data = await response.json()
        console.log('Fallback response:', data)
      } else {
        console.log('OpenAI response successful:', data)
      }

      const aiMessage: ChatMessage = {
        type: 'ai',
        content: data.response || 'Sorry, I had trouble processing that.',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])

      if (data.suggestions) {
        setRecommendations(data.suggestions)
      }

    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: ChatMessage = {
        type: 'ai',
        content: "Sorry, I had trouble processing that. Please try again!",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
      <Navigation isTransparent={true} />
      
      <div style={{ height: '60vh', position: 'relative' }}>
        <Hero />
      </div>
      
      <div className="content-container" style={{ 
        paddingTop: 'var(--spacing-2xl)',
        paddingBottom: 'var(--spacing-2xl)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
          <h1 style={{ 
            fontSize: 'var(--font-size-4xl)', 
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '-0.01em',
            color: 'var(--text-primary)', 
            marginBottom: 'var(--spacing-lg)'
          }}>
            🤖 AI Movie Chat
          </h1>
          <p style={{ 
            fontSize: 'var(--font-size-lg)', 
            color: 'var(--text-secondary)'
          }}>
            Ask for recommendations or tell me what you watched!
          </p>
        </div>

        {/* Chat Area */}
        <div style={{ 
          backgroundColor: 'var(--bg-card)', 
          border: '1px solid var(--bg-secondary)', 
          borderRadius: 'var(--border-radius-lg)',
          padding: 'var(--spacing-xl)',
          marginBottom: 'var(--spacing-xl)',
          boxShadow: 'var(--shadow-lg)'
        }}>
          {/* Messages */}
          <div style={{ 
            height: '500px', 
            overflowY: 'auto', 
            marginBottom: 'var(--spacing-xl)',
            padding: 'var(--spacing-md)',
            backgroundColor: 'var(--bg-primary)',
            borderRadius: 'var(--border-radius)',
            border: '1px solid var(--bg-secondary)'
          }}>
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  marginBottom: 'var(--spacing-lg)',
                  textAlign: message.type === 'user' ? 'right' : 'left'
                }}
              >
                <div
                  style={{
                    display: 'inline-block',
                    maxWidth: '70%',
                    padding: 'var(--spacing-md) var(--spacing-lg)',
                    borderRadius: 'var(--border-radius-full)',
                    backgroundColor: message.type === 'user' ? 'var(--accent-primary)' : 'var(--bg-card)',
                    color: message.type === 'user' ? 'white' : 'var(--text-dark)',
                    boxShadow: 'var(--shadow-sm)',
                    border: message.type === 'user' ? 'none' : '1px solid var(--bg-secondary)'
                  }}
                >
                  <div style={{ 
                    margin: 0, 
                    fontSize: 'var(--font-size-sm)',
                    lineHeight: '1.5'
                  }}>
                    {message.content}
                  </div>
                  <p style={{ 
                    margin: 'var(--spacing-xs) 0 0 0', 
                    fontSize: 'var(--font-size-xs)', 
                    opacity: 0.7 
                  }}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ textAlign: 'left' }}>
                <div style={{
                  display: 'inline-block',
                  padding: 'var(--spacing-md) var(--spacing-lg)',
                  borderRadius: 'var(--border-radius-full)',
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-dark)',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--bg-secondary)'
                }}>
                  <span>Thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
            <input
              type="text"
              placeholder="What's on your mind about movies?"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              style={{
                flex: 1,
                padding: 'var(--spacing-md) var(--spacing-lg)',
                border: '1px solid var(--bg-secondary)',
                borderRadius: 'var(--border-radius-full)',
                fontSize: 'var(--font-size-base)',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                outline: 'none',
                transition: 'all var(--transition-normal)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent-primary)'
                e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--bg-secondary)'
                e.target.style.boxShadow = 'none'
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="btn btn-primary"
              style={{
                padding: 'var(--spacing-md) var(--spacing-xl)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: '600',
                opacity: (!input.trim() || isLoading) ? 0.5 : 1,
                cursor: (!input.trim() || isLoading) ? 'not-allowed' : 'pointer'
              }}
            >
              Send
            </button>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--bg-secondary)',
            borderRadius: 'var(--border-radius-lg)',
            padding: 'var(--spacing-xl)',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <h3 style={{ 
              margin: '0 0 var(--spacing-lg) 0', 
              color: 'var(--text-dark)',
              fontSize: 'var(--font-size-xl)',
              fontWeight: '600'
            }}>
              Recent Recommendations
            </h3>
            <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  style={{
                    padding: 'var(--spacing-lg)',
                    border: '1px solid var(--bg-secondary)',
                    borderRadius: 'var(--border-radius)',
                    backgroundColor: 'var(--bg-primary)',
                    transition: 'all var(--transition-normal)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-primary)'
                  }}
                >
                  <h4 style={{ 
                    margin: '0 0 var(--spacing-sm) 0', 
                    color: 'var(--text-primary)',
                    fontSize: 'var(--font-size-lg)',
                    fontWeight: '600'
                  }}>
                    {rec.movie.title}
                  </h4>
                  {rec.jaqNotes && (
                    <p style={{ 
                      margin: '0 0 var(--spacing-sm) 0', 
                      fontSize: 'var(--font-size-sm)', 
                      color: 'var(--text-secondary)',
                      fontStyle: 'italic'
                    }}>
                      &quot;{rec.jaqNotes}&quot;
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
                    <span style={{
                      padding: 'var(--spacing-xs) var(--spacing-sm)',
                      backgroundColor: rec.recommendedBy === 'jaq' ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                      color: rec.recommendedBy === 'jaq' ? 'white' : 'var(--text-primary)',
                      borderRadius: 'var(--border-radius-full)',
                      fontSize: 'var(--font-size-xs)',
                      fontWeight: '600'
                    }}>
                      {rec.recommendedBy === 'jaq' ? '👑 Jaq' : rec.recommendedBy}
                    </span>
                    <span style={{ fontSize: 'var(--font-size-sm)' }}>
                      {'⭐'.repeat(rec.enthusiasmLevel)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Admin Link */}
        <div style={{ textAlign: 'center', marginTop: 'var(--spacing-xl)' }}>
          <a 
            href="/admin" 
            style={{ 
              color: 'var(--accent-primary)', 
              textDecoration: 'none',
              fontSize: 'var(--font-size-sm)',
              transition: 'color var(--transition-fast)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--accent-hover)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--accent-primary)'
            }}
          >
            Import Jaq&apos;s Collection (Admin)
          </a>
        </div>
      </div>
    </div>
  )
}