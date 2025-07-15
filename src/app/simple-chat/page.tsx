'use client'

import { useState } from 'react'

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
      content: "Hi! I'm here to help with movie recommendations. You can tell me what you just watched, or ask me what you should watch next!",
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
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      })

      const data = await response.json()

      const aiMessage: ChatMessage = {
        type: 'ai',
        content: data.response,
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
    <div style={{ 
      minHeight: '100vh', 
      padding: '20px', 
      fontFamily: 'system-ui, sans-serif',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '32px', color: '#333', marginBottom: '10px' }}>
            Movie Chat
          </h1>
          <p style={{ fontSize: '18px', color: '#666' }}>
            Tell me what you watched, or ask for recommendations!
          </p>
        </div>

        {/* Chat Area */}
        <div style={{ 
          backgroundColor: 'white', 
          border: '1px solid #ddd', 
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          {/* Messages */}
          <div style={{ 
            height: '400px', 
            overflowY: 'auto', 
            marginBottom: '20px',
            padding: '10px'
          }}>
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  marginBottom: '15px',
                  textAlign: message.type === 'user' ? 'right' : 'left'
                }}
              >
                <div
                  style={{
                    display: 'inline-block',
                    maxWidth: '70%',
                    padding: '12px 16px',
                    borderRadius: '18px',
                    backgroundColor: message.type === 'user' ? '#007bff' : '#e9ecef',
                    color: message.type === 'user' ? 'white' : '#333'
                  }}
                >
                  <p style={{ margin: 0, fontSize: '14px' }}>{message.content}</p>
                  <p style={{ 
                    margin: '5px 0 0 0', 
                    fontSize: '11px', 
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
                  padding: '12px 16px',
                  borderRadius: '18px',
                  backgroundColor: '#e9ecef',
                  color: '#333'
                }}>
                  <span>Thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="What's on your mind about movies?"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              style={{
                padding: '12px 24px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                opacity: (!input.trim() || isLoading) ? 0.5 : 1
              }}
            >
              Send
            </button>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px'
          }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>
              Recent Recommendations
            </h3>
            <div style={{ display: 'grid', gap: '10px' }}>
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  style={{
                    padding: '15px',
                    border: '1px solid #eee',
                    borderRadius: '6px',
                    backgroundColor: '#f9f9f9'
                  }}
                >
                  <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>
                    {rec.movie.title}
                  </h4>
                  {rec.jaqNotes && (
                    <p style={{ 
                      margin: '0 0 5px 0', 
                      fontSize: '12px', 
                      color: '#666',
                      fontStyle: 'italic'
                    }}>
                      &quot;{rec.jaqNotes}&quot;
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{
                      padding: '2px 8px',
                      backgroundColor: rec.recommendedBy === 'jaq' ? '#ffd700' : '#ddd',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }}>
                      {rec.recommendedBy === 'jaq' ? '👑 Jaq' : rec.recommendedBy}
                    </span>
                    <span style={{ fontSize: '12px' }}>
                      {'⭐'.repeat(rec.enthusiasmLevel)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Admin Link */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <a 
            href="/admin" 
            style={{ 
              color: '#007bff', 
              textDecoration: 'none',
              fontSize: '14px'
            }}
          >
            Import Jaq&apos;s Collection (Admin)
          </a>
        </div>
      </div>
    </div>
  )
}