import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Simple pattern-based fallback when OpenAI isn't available
interface MovieContext {
  title: string;
  overview?: string | null;
  rating?: number | null;
  jaqNotes?: string | null;
  enthusiasmLevel?: number;
}

function getRecommendationResponse(message: string, movies: MovieContext[]) {
  const lowerMessage = message.toLowerCase()
  
  // Genre-based recommendations
  if (lowerMessage.includes('sci-fi') || lowerMessage.includes('science fiction')) {
    const sciFiMovies = movies.filter(m => 
      m.title.toLowerCase().includes('inception') ||
      m.title.toLowerCase().includes('interstellar') ||
      m.title.toLowerCase().includes('ad astra') ||
      m.overview?.toLowerCase().includes('space') ||
      m.overview?.toLowerCase().includes('future')
    )
    if (sciFiMovies.length > 0) {
      const movie = sciFiMovies[0]
      return `For sci-fi, I recommend "${movie.title}"! ${movie.jaqNotes ? `Jaq says: ${movie.jaqNotes}` : ''} ${movie.rating ? `TMDB rating: ${movie.rating}/10` : ''}`
    }
  }
  
  if (lowerMessage.includes('horror')) {
    const horrorMovies = movies.filter(m => 
      m.overview?.toLowerCase().includes('horror') ||
      m.overview?.toLowerCase().includes('scary') ||
      m.title.toLowerCase().includes('fresh')
    )
    if (horrorMovies.length > 0) {
      const movie = horrorMovies[0]
      return `For horror, try "${movie.title}"! ${movie.jaqNotes ? `Jaq's note: ${movie.jaqNotes}` : ''}`
    }
  }
  
  if (lowerMessage.includes('comedy')) {
    const comedyMovies = movies.filter(m => 
      m.overview?.toLowerCase().includes('comedy') ||
      m.overview?.toLowerCase().includes('funny')
    )
    if (comedyMovies.length > 0) {
      const movie = comedyMovies[0]
      return `For comedy, I suggest "${movie.title}"! ${movie.jaqNotes ? `Jaq says: ${movie.jaqNotes}` : ''}`
    }
  }
  
  // Default recommendation - highest enthusiasm
  const topMovies = movies
    .filter(m => (m.enthusiasmLevel || 0) >= 4)
    .sort((a, b) => (b.enthusiasmLevel || 0) - (a.enthusiasmLevel || 0))
    .slice(0, 3)
  
  if (topMovies.length > 0) {
    const recommendations = topMovies.map(m => `"${m.title}"`).join(', ')
    return `Here are some of Jaq's top picks: ${recommendations}. What genre interests you most?`
  }
  
  return "I have movies in the collection, but I need more specific preferences. Try asking for a genre like sci-fi, horror, or comedy!"
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()
    
    console.log('Fallback chat processing:', message)
    
    if (!message) {
      return NextResponse.json({
        response: 'Please ask me about movies! Try "recommend a sci-fi movie" or "what should I watch tonight?"',
        status: 'completed'
      })
    }
    
    // Get movies from database with detailed logging
    let movies = []
    try {
      console.log('Attempting to fetch movies from database...')
      movies = await prisma.movie.findMany({
        include: {
          recommendations: {
            where: { recommendedBy: 'jaq' },
            orderBy: { enthusiasmLevel: 'desc' }
          }
        },
        take: 20,
        orderBy: { createdAt: 'desc' }
      })
      console.log(`Found ${movies.length} movies in database`)
    } catch (dbError) {
      console.error('Database error in fallback:', dbError)
      return NextResponse.json({
        response: "I'm having trouble connecting to the movie database. Please check the /movies page to see if data is loaded, or visit the Admin panel to import movies.",
        status: 'error'
      }, { status: 200 })
    }
    
    const movieContext = movies.map(movie => ({
      title: movie.title,
      overview: movie.overview,
      rating: movie.rating,
      jaqNotes: movie.recommendations[0]?.jaqNotes,
      enthusiasmLevel: movie.recommendations[0]?.enthusiasmLevel
    }))
    
    console.log('Movie context created:', movieContext.length, 'items')
    
    if (movieContext.length === 0) {
      return NextResponse.json({
        response: "I don't have any movies loaded yet! Please visit the Admin panel (/admin) to import Jaq's collection first. You can also check the Movies page to see the current status.",
        status: 'completed'
      })
    }
    
    const response = getRecommendationResponse(message, movieContext)
    console.log('Generated response:', response)
    
    // Store conversation (optional, don't fail if this fails)
    try {
      await prisma.conversation.create({
        data: {
          input: message,
          intent: 'REQUEST_RECOMMENDATION',
          response
        }
      })
    } catch (conversationError) {
      console.warn('Failed to store conversation, but continuing:', conversationError)
    }
    
    return NextResponse.json({
      response,
      status: 'completed'
    })
    
  } catch (error) {
    console.error('Fallback chat error:', error)
    return NextResponse.json({
      response: `Sorry, I had trouble processing that (${error instanceof Error ? error.message : 'unknown error'}). Please try browsing the movies manually at /movies!`,
      status: 'error'
    }, { status: 200 })
  }
}