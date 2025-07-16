import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Simple pattern-based fallback when OpenAI isn't available
interface MovieContext {
  title: string;
  overview?: string | null;
  rating?: number | null;
  genres?: string[] | null;
  jaqNotes?: string | null;
  enthusiasmLevel?: number;
}

function getRecommendationResponse(message: string, movies: MovieContext[]) {
  const lowerMessage = message.toLowerCase()
  
  // Enhanced sci-fi detection
  if (lowerMessage.includes('sci-fi') || lowerMessage.includes('sci fi') || 
      lowerMessage.includes('science fiction') || lowerMessage.includes('scifi') ||
      lowerMessage.includes('space') || lowerMessage.includes('ai') ||
      lowerMessage.includes('artificial intelligence') || lowerMessage.includes('future')) {
    
    const sciFiMovies = movies.filter(m => {
      const titleMatch = m.title.toLowerCase().includes('inception') ||
                        m.title.toLowerCase().includes('interstellar') ||
                        m.title.toLowerCase().includes('matrix') ||
                        m.title.toLowerCase().includes('blade runner') ||
                        m.title.toLowerCase().includes('alien') ||
                        m.title.toLowerCase().includes('star')
      
      const overviewMatch = m.overview?.toLowerCase().includes('space') ||
                           m.overview?.toLowerCase().includes('future') ||
                           m.overview?.toLowerCase().includes('alien') ||
                           m.overview?.toLowerCase().includes('technology') ||
                           m.overview?.toLowerCase().includes('artificial') ||
                           m.overview?.toLowerCase().includes('robot') ||
                           m.overview?.toLowerCase().includes('cyber')
      
      const genreMatch = m.genres?.some(genre => 
        genre === '878' || // TMDB sci-fi genre ID
        genre.toLowerCase().includes('sci')
      )
      
      return titleMatch || overviewMatch || genreMatch
    })
    
    if (sciFiMovies.length > 0) {
      const topSciFi = sciFiMovies.sort((a, b) => (b.enthusiasmLevel || 0) - (a.enthusiasmLevel || 0)).slice(0, 2)
      if (topSciFi.length === 1) {
        const movie = topSciFi[0]
        return `Perfect! For sci-fi, I recommend "${movie.title}"${movie.jaqNotes ? ` - ${movie.jaqNotes}` : ''}${movie.rating ? ` (${movie.rating}/10)` : ''}. Sound interesting?`
      } else {
        const titles = topSciFi.map(m => `"${m.title}"`).join(' or ')
        return `Great choice! For sci-fi, I'd suggest ${titles}. Both are excellent picks from Jaq's collection!`
      }
    }
  }
  
  // Enhanced horror detection
  if (lowerMessage.includes('horror') || lowerMessage.includes('scary') || 
      lowerMessage.includes('thriller') || lowerMessage.includes('suspense')) {
    
    const horrorMovies = movies.filter(m => {
      const titleMatch = m.title.toLowerCase().includes('fresh') ||
                        m.title.toLowerCase().includes('horror') ||
                        m.title.toLowerCase().includes('nightmare') ||
                        m.title.toLowerCase().includes('dead')
      
      const overviewMatch = m.overview?.toLowerCase().includes('horror') ||
                           m.overview?.toLowerCase().includes('scary') ||
                           m.overview?.toLowerCase().includes('terror') ||
                           m.overview?.toLowerCase().includes('killer') ||
                           m.overview?.toLowerCase().includes('murder')
      
      const genreMatch = m.genres?.some(genre => 
        genre === '27' || // TMDB horror genre ID
        genre.toLowerCase().includes('horror') ||
        genre.toLowerCase().includes('thriller')
      )
      
      return titleMatch || overviewMatch || genreMatch
    })
    
    if (horrorMovies.length > 0) {
      const movie = horrorMovies.sort((a, b) => (b.enthusiasmLevel || 0) - (a.enthusiasmLevel || 0))[0]
      return `For something scary, try "${movie.title}"!${movie.jaqNotes ? ` Jaq's note: ${movie.jaqNotes}` : ''}${movie.rating ? ` (${movie.rating}/10)` : ''}`
    }
  }
  
  // Enhanced comedy detection
  if (lowerMessage.includes('comedy') || lowerMessage.includes('funny') || 
      lowerMessage.includes('laugh') || lowerMessage.includes('humor')) {
    
    const comedyMovies = movies.filter(m => {
      const titleMatch = m.title.toLowerCase().includes('comedy') ||
                        m.title.toLowerCase().includes('funny')
      
      const overviewMatch = m.overview?.toLowerCase().includes('comedy') ||
                           m.overview?.toLowerCase().includes('funny') ||
                           m.overview?.toLowerCase().includes('humor') ||
                           m.overview?.toLowerCase().includes('laugh')
      
      const genreMatch = m.genres?.some(genre => 
        genre === '35' || // TMDB comedy genre ID
        genre.toLowerCase().includes('comedy')
      )
      
      return titleMatch || overviewMatch || genreMatch
    })
    
    if (comedyMovies.length > 0) {
      const movie = comedyMovies.sort((a, b) => (b.enthusiasmLevel || 0) - (a.enthusiasmLevel || 0))[0]
      return `For a good laugh, check out "${movie.title}"!${movie.jaqNotes ? ` ${movie.jaqNotes}` : ''}${movie.rating ? ` (${movie.rating}/10)` : ''}`
    }
  }
  
  // General recommendation request
  if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest') || 
      lowerMessage.includes('watch') || lowerMessage.includes('good')) {
    
    const topMovies = movies
      .filter(m => (m.enthusiasmLevel || 0) >= 4)
      .sort((a, b) => (b.enthusiasmLevel || 0) - (a.enthusiasmLevel || 0))
      .slice(0, 3)
    
    if (topMovies.length > 0) {
      if (topMovies.length === 1) {
        const movie = topMovies[0]
        return `I highly recommend "${movie.title}"!${movie.jaqNotes ? ` ${movie.jaqNotes}` : ''}${movie.rating ? ` (${movie.rating}/10)` : ''} What do you think?`
      } else {
        const titles = topMovies.map(m => `"${m.title}"`).join(', ')
        return `Here are Jaq's top picks: ${titles}. Any of these sound good to you?`
      }
    }
  }
  
  // Show some available movies if no specific genre found
  const sampleMovies = movies.slice(0, 3).map(m => `"${m.title}"`).join(', ')
  return `I have ${movies.length} movies in Jaq's collection! Some options include: ${sampleMovies}. What genre or mood are you in the mood for?`
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
      genres: movie.genres,
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