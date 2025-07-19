import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import OpenAI from 'openai'

const prisma = new PrismaClient()
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY?.trim()
})

interface TMDBMovie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  vote_average: number
}

async function searchSimilarMovies(userMessage: string): Promise<TMDBMovie[]> {
  const tmdbApiKey = process.env.TMDB_API_KEY?.trim()
  if (!tmdbApiKey) {
    console.log('TMDB API key not found in environment variables')
    return []
  }
  
  console.log('TMDB API key found, searching for movies similar to:', userMessage)

  const tmdbHeaders = {
    'Authorization': `Bearer ${tmdbApiKey}`,
    'Content-Type': 'application/json'
  }

  try {
    // Extract movie name from user message using simple patterns
    let movieName = ''
    
    // Look for patterns like "similar to X" or "like X" - improved regex
    const similarMatch = userMessage.match(/similar to\s+(.+?)(?:\s*[.!?]|$)/i)
    const likeMatch = userMessage.match(/like\s+(.+?)(?:\s*[.!?]|$)/i)
    
    console.log('Checking message for patterns:', userMessage)
    console.log('Similar match:', similarMatch)
    console.log('Like match:', likeMatch)
    
    if (similarMatch) {
      movieName = similarMatch[1].trim()
      console.log('Found movie name from similar pattern:', movieName)
    } else if (likeMatch) {
      movieName = likeMatch[1].trim()
      console.log('Found movie name from like pattern:', movieName)
    } else {
      // Fallback: just search for popular movies in relevant genres
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?page=1`,
        { headers: tmdbHeaders }
      )
      
      if (response.ok) {
        const data = await response.json()
        return data.results.slice(0, 6) // Return 6 popular movies
      }
      return []
    }

    console.log('Searching TMDB for movies similar to:', movieName)

    // First, search for the movie they mentioned
    const searchUrl = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(movieName)}&page=1`
    console.log('TMDB search URL:', searchUrl)
    
    const searchResponse = await fetch(searchUrl, { headers: tmdbHeaders })

    if (!searchResponse.ok) {
      console.error('TMDB search failed:', searchResponse.status, searchResponse.statusText)
      return []
    }

    const searchData = await searchResponse.json()
    console.log('TMDB search returned:', searchData.results?.length || 0, 'results')
    
    if (searchData.results.length === 0) {
      console.log('No movies found for:', movieName)
      return []
    }

    const targetMovie = searchData.results[0]
    console.log('Found target movie:', targetMovie.title, 'with ID:', targetMovie.id)

    // Get similar movies using TMDB's similar endpoint
    const similarUrl = `https://api.themoviedb.org/3/movie/${targetMovie.id}/similar?page=1`
    console.log('Fetching similar movies from:', similarUrl)
    
    const similarResponse = await fetch(similarUrl, { headers: tmdbHeaders })

    if (!similarResponse.ok) {
      console.error('TMDB similar movies failed:', similarResponse.status, similarResponse.statusText)
      return []
    }

    const similarData = await similarResponse.json()
    console.log('TMDB similar movies returned:', similarData.results?.length || 0, 'results')
    
    // Return top 6 similar movies with good ratings and descriptions
    const filteredMovies = similarData.results
      .filter((movie: TMDBMovie) => movie.vote_average > 6.0 && movie.overview)
      .slice(0, 6)
      
    console.log('After filtering (rating > 6.0 and has overview):', filteredMovies.length, 'movies')
    return filteredMovies

  } catch (error) {
    console.error('Error searching similar movies:', error)
    return []
  }
}

async function searchSpecificMovie(movieQuery: string): Promise<TMDBMovie[]> {
  const tmdbApiKey = process.env.TMDB_API_KEY?.trim()
  if (!tmdbApiKey) {
    console.log('TMDB API key not found for specific movie search')
    return []
  }
  
  console.log('Searching TMDB for specific movie:', movieQuery)

  const tmdbHeaders = {
    'Authorization': `Bearer ${tmdbApiKey}`,
    'Content-Type': 'application/json'
  }

  try {
    const searchUrl = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(movieQuery)}&page=1`
    console.log('TMDB specific search URL:', searchUrl)
    
    const searchResponse = await fetch(searchUrl, { headers: tmdbHeaders })

    if (!searchResponse.ok) {
      console.error('TMDB specific search failed:', searchResponse.status, searchResponse.statusText)
      return []
    }

    const searchData = await searchResponse.json()
    console.log('TMDB specific search returned:', searchData.results?.length || 0, 'results')
    
    if (searchData.results.length === 0) {
      console.log('No movies found for:', movieQuery)
      return []
    }

    // Return top 3 most relevant movies
    const topResults = searchData.results
      .filter((movie: TMDBMovie) => movie.overview && movie.poster_path)
      .slice(0, 3)
      
    console.log('After filtering (has overview and poster):', topResults.length, 'movies')
    return topResults

  } catch (error) {
    console.error('Error searching specific movie:', error)
    return []
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()
    
    if (!message) {
      return NextResponse.json({ 
        error: 'Message is required',
        response: 'Please provide a message to get movie recommendations.',
        status: 'error'
      }, { status: 200 })
    }

    console.log('Processing message:', message)
    console.log('Environment check:')
    console.log('- OPENAI_API_KEY present:', !!process.env.OPENAI_API_KEY)
    console.log('- TMDB_API_KEY present:', !!process.env.TMDB_API_KEY)
    console.log('- TMDB_API_KEY length:', process.env.TMDB_API_KEY?.length || 0)
    
    // Check if OpenAI is configured
    if (!process.env.OPENAI_API_KEY) {
      console.log('OpenAI API key not configured, will fallback')
      return NextResponse.json({
        error: 'OpenAI not configured',
        response: 'AI chat is not available right now. Using basic recommendations instead.',
        status: 'error'
      }, { status: 200 })
    }
    
    console.log('OpenAI API key found, checking TMDB API key...')
    console.log('TMDB API key present:', !!process.env.TMDB_API_KEY)
    
    console.log('OpenAI API key found, proceeding with AI request')
    
    // Get some movies from database for context
    let movieContext = []
    try {
      const movies = await prisma.movie.findMany({
        include: {
          recommendations: {
            where: { recommendedBy: 'jaq' },
            orderBy: { enthusiasmLevel: 'desc' }
          }
        },
        take: 10,
        orderBy: { createdAt: 'desc' }
      })
      
      movieContext = movies.map(movie => ({
        title: movie.title,
        overview: movie.overview || 'No overview',
        rating: movie.rating,
        genres: movie.genres,
        jaqNotes: movie.recommendations[0]?.jaqNotes,
        enthusiasmLevel: movie.recommendations[0]?.enthusiasmLevel
      }))
      
      console.log(`Found ${movies.length} movies in database`)
      
      if (movies.length === 0) {
        return NextResponse.json({
          response: "I don't have any movies loaded yet! Please go to the Admin panel and import Jaq's collection first.",
          status: 'completed'
        })
      }
    } catch (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json({
        response: "I'm having trouble accessing the movie database. Please try again later or check the Admin panel.",
        status: 'error'
      }, { status: 200 })
    }
    
    // Check if user is asking for similar movies
    const isSimilarMovieRequest = message.toLowerCase().includes('similar') || 
                                  message.toLowerCase().includes('like') ||
                                  message.toLowerCase().includes('find') ||
                                  message.toLowerCase().includes('recommend')

    // Check if user is asking for a specific movie
    const isSpecificMovieRequest = message.toLowerCase().includes('show me') ||
                                   message.toLowerCase().includes('add') ||
                                   message.toLowerCase().includes('display') ||
                                   message.toLowerCase().includes('get')

    console.log('Is similar movie request:', isSimilarMovieRequest)
    console.log('Is specific movie request:', isSpecificMovieRequest)
    console.log('User message:', message)
    console.log('TMDB_API_KEY available:', !!process.env.TMDB_API_KEY?.trim())

    let movieSuggestions: TMDBMovie[] = []
    
    // If requesting similar movies, search TMDB
    if (isSimilarMovieRequest && process.env.TMDB_API_KEY?.trim()) {
      console.log('Attempting TMDB search...')
      try {
        movieSuggestions = await searchSimilarMovies(message)
        console.log('Found', movieSuggestions.length, 'movie suggestions from TMDB')
      } catch (tmdbError) {
        console.error('TMDB search failed with error:', tmdbError)
      }
    } else {
      console.log('Skipping TMDB search - isSimilarMovieRequest:', isSimilarMovieRequest, 'TMDB_API_KEY present:', !!process.env.TMDB_API_KEY)
    }

    // Check for specific movie requests if no similar movies found yet
    if (movieSuggestions.length === 0 && isSpecificMovieRequest && process.env.TMDB_API_KEY?.trim()) {
      console.log('Attempting specific movie search...')
      console.log('Conditions met: movieSuggestions.length =', movieSuggestions.length, 'isSpecificMovieRequest =', isSpecificMovieRequest, 'TMDB_API_KEY =', !!process.env.TMDB_API_KEY?.trim())
      try {
        // Extract movie name from the request
        let movieQuery = ''
        
        // Try to extract movie name from various patterns
        const showMeMatch = message.match(/show me (?:the movie )?(?:for )?(.+?)(?:\s*$|[.!?])/i)
        const addMatch = message.match(/add (.+?)(?:\s+to|$)/i)
        const displayMatch = message.match(/display (?:the movie )?(?:for )?(.+?)(?:\s*$|[.!?])/i)
        const getMatch = message.match(/get (?:the movie )?(?:for )?(.+?)(?:\s*$|[.!?])/i)
        
        console.log('Regex matches:', { showMeMatch, addMatch, displayMatch, getMatch })
        
        if (showMeMatch) {
          movieQuery = showMeMatch[1].trim()
        } else if (addMatch) {
          movieQuery = addMatch[1].trim()
        } else if (displayMatch) {
          movieQuery = displayMatch[1].trim()
        } else if (getMatch) {
          movieQuery = getMatch[1].trim()
        }
        
        // Clean up common suffixes
        movieQuery = movieQuery.replace(/\s+(movie|film|to (?:the )?(?:database|collection))$/i, '').trim()
        
        console.log('Extracted movie query:', movieQuery)
        
        if (movieQuery) {
          console.log('Searching TMDB for extracted query:', movieQuery)
          movieSuggestions = await searchSpecificMovie(movieQuery)
          console.log('Found', movieSuggestions.length, 'specific movies from TMDB for query:', movieQuery)
        } else {
          console.log('No movie query extracted from message:', message)
        }
      } catch (tmdbError) {
        console.error('Specific movie search failed with error:', tmdbError)
      }
    } else if (isSpecificMovieRequest) {
      console.log('Skipping specific movie search - movieSuggestions already found or TMDB_API_KEY missing')
    }

    // Simple OpenAI chat completion
    try {
      console.log('Making OpenAI request with', movieContext.length, 'movies in context')
      
      const systemPrompt = movieSuggestions.length > 0 
        ? (isSpecificMovieRequest 
           ? `You are a movie discovery assistant. The user requested a specific movie and I found ${movieSuggestions.length} matching results from TMDB. Present the movie(s) I found and offer to add them to their collection. Be helpful and enthusiastic. Keep responses under 100 words.`
           : `You are a movie discovery assistant. The user is asking for movie recommendations. I've found ${movieSuggestions.length} movies from TMDB that match their request. Respond conversationally about the suggestions and encourage them to add interesting movies to their collection. Keep responses under 100 words.`)
        : `You are a movie recommendation assistant for Jaq's curated collection. Here are the available movies:

${movieContext.slice(0, 10).map(movie => 
  `"${movie.title}" (${movie.rating || 'No rating'}/10)${movie.jaqNotes ? ` - ${movie.jaqNotes}` : ''}${movie.genres ? ` Genres: ${movie.genres.join(', ')}` : ''}`
).join('\n')}

Help users discover movies from this collection. Be conversational and provide specific recommendations. If asking for a genre like sci-fi, look for relevant movies and recommend them. Keep responses under 150 words.`

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini', // Use the faster, cheaper model
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 250
      })
      
      const aiResponse = response.choices[0]?.message?.content || 'Sorry, I had trouble processing that.'
      console.log('OpenAI response received')
      
      // Store conversation
      try {
        await prisma.conversation.create({
          data: {
            input: message,
            intent: 'REQUEST_RECOMMENDATION',
            response: aiResponse
          }
        })
      } catch (dbError) {
        console.warn('Failed to store conversation:', dbError)
        // Continue anyway
      }
      
      return NextResponse.json({
        response: aiResponse,
        movieSuggestions: movieSuggestions,
        status: 'completed'
      })
      
    } catch (openaiError) {
      console.error('OpenAI API error details:', {
        message: openaiError instanceof Error ? openaiError.message : 'Unknown error',
        error: openaiError
      })
      
      // Even if OpenAI fails, return TMDB suggestions if we have them
      const fallbackResponse = movieSuggestions.length > 0 
        ? `I found ${movieSuggestions.length} movies similar to what you're looking for! Check out the suggestions below and add any that interest you to your collection.`
        : "I'm having trouble with the AI right now. You can still browse movies in the Movies section!"
      
      return NextResponse.json({
        response: fallbackResponse,
        movieSuggestions: movieSuggestions, // Include TMDB suggestions even when OpenAI fails
        error: openaiError instanceof Error ? openaiError.message : 'Unknown OpenAI error',
        status: movieSuggestions.length > 0 ? 'completed' : 'error'
      }, { status: 200 })
    }
    
  } catch (error) {
    console.error('Simple assistant API error:', error)
    return NextResponse.json({ 
      error: 'Failed to process message',
      response: 'Something went wrong. Please try again or browse movies manually.',
      status: 'error'
    }, { status: 200 })
  }
}