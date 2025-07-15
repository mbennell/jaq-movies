'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Button, 
  Card, 
  CardBody, 
  Input,
  Chip,
  Spinner
} from '@heroui/react'
import Image from 'next/image'

interface Movie {
  id: string
  title: string
  originalTitle?: string
  overview?: string
  releaseDate?: string
  posterPath?: string
  rating?: number
  type: string
}

interface Recommendation {
  id: string
  recommendedBy: string
  status: string
  jaqNotes?: string
  enthusiasmLevel: number
  movie: Movie
  createdAt: string
}

interface ChatMessage {
  type: 'user' | 'ai'
  content: string
  timestamp: Date
}

export default function ChatPage() {
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
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-primary mb-4">
            🎬 Chat with Jaq's Movie Guide
          </h1>
          <p className="text-xl text-foreground/80">
            Tell me what you watched, or ask for recommendations!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat Area */}
          <div className="lg:col-span-2">
            <Card className="bg-background/60 backdrop-blur-md border-primary/30 h-[600px] flex flex-col">
              <CardBody className="flex flex-col h-full p-6">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-4 rounded-2xl ${
                          message.type === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-background/80 border border-foreground/20'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-2">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-background/80 border border-foreground/20 p-4 rounded-2xl">
                        <Spinner size="sm" />
                        <span className="ml-2 text-sm">Thinking...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="flex gap-2">
                  <Input
                    placeholder="What's on your mind about movies?"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    variant="bordered"
                    size="lg"
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button
                    color="primary"
                    size="lg"
                    onClick={sendMessage}
                    disabled={!input.trim() || isLoading}
                  >
                    Send
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Recommendations Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-background/60 backdrop-blur-md border-primary/30">
              <CardBody className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-primary">
                  Recent Recommendations
                </h3>
                
                {recommendations.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">🎬</div>
                    <p className="text-foreground/70 text-sm">
                      Ask for recommendations to see suggestions here!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recommendations.map((rec) => (
                      <motion.div
                        key={rec.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="border border-foreground/20 rounded-lg p-4"
                      >
                        <div className="flex gap-3">
                          <div className="w-12 h-16 bg-foreground/10 rounded flex items-center justify-center overflow-hidden">
                            {rec.movie.posterPath ? (
                              <Image
                                src={`https://image.tmdb.org/t/p/w200${rec.movie.posterPath}`}
                                alt={rec.movie.title}
                                width={48}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-lg">📽️</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm">{rec.movie.title}</h4>
                            {rec.jaqNotes && (
                              <p className="text-xs text-primary mt-1">"{rec.jaqNotes}"</p>
                            )}
                            <div className="flex items-center gap-1 mt-2">
                              <Chip 
                                size="sm" 
                                color={rec.recommendedBy === 'jaq' ? 'primary' : 'secondary'}
                                className="text-xs"
                              >
                                {rec.recommendedBy === 'jaq' ? '👑 Jaq' : rec.recommendedBy}
                              </Chip>
                              <div className="flex">
                                {Array.from({ length: rec.enthusiasmLevel }, (_, i) => (
                                  <span key={i} className="text-warning text-xs">⭐</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}