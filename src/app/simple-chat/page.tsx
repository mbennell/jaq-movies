'use client'

import { useState } from 'react'
import Image from 'next/image'
import Navigation from '../../components/Navigation'

interface ChatMessage {
  type: 'user' | 'ai'
  content: string
  timestamp: Date
}



export default function SimpleChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      type: 'ai',
      content: "Hi! I'm your movie discovery assistant. Ask me to find movies similar to your favorites, and I'll search through thousands of films to find perfect matches. I can also add great movies directly to your collection! 🎬",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [movieSuggestions, setMovieSuggestions] = useState<TMDBMovie[]>([])

interface TMDBMovie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  vote_average: number
}

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

      // Handle movie suggestions from TMDB
      if (data.movieSuggestions) {
        setMovieSuggestions(data.movieSuggestions)
      }

      // Remove unused recommendations handling

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

  const addMovieToCollection = async (tmdbId: number) => {
    try {
      const response = await fetch('/api/movies/add-from-tmdb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tmdbId }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        const successMessage: ChatMessage = {
          type: 'ai',
          content: `Great! "${data.movie.title}" has been added to your collection! 🎉`,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, successMessage])
      } else {
        const errorMessage: ChatMessage = {
          type: 'ai',
          content: data.alreadyExists 
            ? `"${data.movie?.title || 'This movie'}" is already in your collection!`
            : `Sorry, I couldn't add that movie: ${data.message}`,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, errorMessage])
      }
    } catch (error) {
      console.error('Error adding movie:', error)
      const errorMessage: ChatMessage = {
        type: 'ai',
        content: "Sorry, I had trouble adding that movie to your collection. Please try again!",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="page-container">
      <Navigation isTransparent={false} />
      
      <div className="chat-page-container">
        {/* Header */}
        <div className="chat-page-header">
          <h1 className="chat-page-title">
            🎬 Movie Discovery Chat
          </h1>
          <p className="chat-page-subtitle">
            Ask me to find movies similar to your favorites, or discover something new!
          </p>
          <div className="chat-examples">
            <span className="chat-example">Try: &quot;Find something similar to Interstellar&quot;</span>
            <span className="chat-example">Or: &quot;I want a sci-fi thriller like Arrival&quot;</span>
          </div>
        </div>

        {/* Main Chat Interface */}
        <div className="chat-interface">
          <div className="chat-container">
            {/* Messages */}
            <div className="chat-messages">
              {messages.map((message, index) => (
                <div key={index} className={`message ${message.type}`}>
                  <div className={`message-bubble ${message.type}`}>
                    <div className="message-content">
                      {message.content}
                    </div>
                    <p className="message-time">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="message ai">
                  <div className="message-bubble ai">
                    <span>Searching for movies...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Movie Suggestions */}
            {movieSuggestions.length > 0 && (
              <div className="movie-suggestions">
                <h3>Movie Suggestions</h3>
                <div className="suggestions-grid">
                  {movieSuggestions.map((movie, index) => (
                    <div key={index} className="movie-suggestion-card">
                      {movie.poster_path && (
                        <Image 
                          src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                          alt={movie.title}
                          className="suggestion-poster"
                          width={150}
                          height={225}
                        />
                      )}
                      <div className="suggestion-content">
                        <h4>{movie.title}</h4>
                        <p className="suggestion-overview">{movie.overview}</p>
                        <div className="suggestion-actions">
                          <button 
                            className="btn btn-primary add-to-collection"
                            onClick={() => addMovieToCollection(movie.id)}
                          >
                            Add to Collection
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="chat-input-container">
              <input
                type="text"
                placeholder="Ask me to find movies similar to your favorites..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="chat-input"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="btn btn-primary chat-send-btn"
              >
                {isLoading ? 'Searching...' : 'Send'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}