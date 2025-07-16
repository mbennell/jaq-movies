import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // First, try to find the movie in our database
    const movie = await prisma.movie.findFirst({
      where: {
        OR: [
          { id: id },
          { tmdbId: parseInt(id) }
        ]
      },
      include: {
        recommendations: true
      }
    })

    if (!movie) {
      return NextResponse.json(
        { error: 'Movie not found', success: false },
        { status: 404 }
      )
    }

    // Get TMDB API key from environment
    const tmdbApiKey = process.env.TMDB_API_KEY
    if (!tmdbApiKey) {
      console.error('TMDB API key not configured')
      // Return basic movie data without TMDB enhancements
      return NextResponse.json({
        success: true,
        movie: {
          id: movie.tmdbId || movie.id,
          title: movie.title,
          overview: movie.overview || 'No overview available',
          release_date: movie.releaseDate?.toISOString().split('T')[0] || '',
          poster_path: movie.posterPath || '',
          vote_average: movie.rating || 0,
          jaqNotes: movie.recommendations.find(r => r.recommendedBy === 'jaq')?.jaqNotes || null,
          enthusiasmLevel: movie.recommendations.find(r => r.recommendedBy === 'jaq')?.enthusiasmLevel || 3
        }
      })
    }

    const tmdbId = movie.tmdbId || movie.id

    // Fetch detailed movie data from TMDB
    const [movieDetails, credits, watchProviders] = await Promise.allSettled([
      fetch(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${tmdbApiKey}`),
      fetch(`https://api.themoviedb.org/3/movie/${tmdbId}/credits?api_key=${tmdbApiKey}`),
      fetch(`https://api.themoviedb.org/3/movie/${tmdbId}/watch/providers?api_key=${tmdbApiKey}`)
    ])

    let tmdbMovie = null
    let tmdbCredits = null
    let tmdbWatchProviders = null

    // Parse TMDB movie details
    if (movieDetails.status === 'fulfilled' && movieDetails.value.ok) {
      tmdbMovie = await movieDetails.value.json()
    }

    // Parse TMDB credits
    if (credits.status === 'fulfilled' && credits.value.ok) {
      tmdbCredits = await credits.value.json()
    }

    // Parse TMDB watch providers
    if (watchProviders.status === 'fulfilled' && watchProviders.value.ok) {
      tmdbWatchProviders = await watchProviders.value.json()
    }

    // Combine our database data with TMDB data
    const enhancedMovie = {
      id: movie.tmdbId || movie.id,
      title: movie.title,
      overview: movie.overview || tmdbMovie?.overview || 'No overview available',
      release_date: movie.releaseDate?.toISOString().split('T')[0] || tmdbMovie?.release_date || '',
      poster_path: movie.posterPath || tmdbMovie?.poster_path || '',
      backdrop_path: tmdbMovie?.backdrop_path || null,
      vote_average: movie.rating || tmdbMovie?.vote_average || 0,
      runtime: tmdbMovie?.runtime || null,
      genres: tmdbMovie?.genres || [],
      cast: tmdbCredits?.cast?.slice(0, 10) || [],
      crew: tmdbCredits?.crew?.filter((person: { job: string }) => 
        ['Director', 'Producer', 'Executive Producer', 'Screenplay', 'Writer'].includes(person.job)
      ).slice(0, 5) || [],
      jaqNotes: movie.recommendations.find(r => r.recommendedBy === 'jaq')?.jaqNotes || null,
      enthusiasmLevel: movie.recommendations.find(r => r.recommendedBy === 'jaq')?.enthusiasmLevel || 3,
      streaming_providers: tmdbWatchProviders?.results?.US || null
    }

    return NextResponse.json({
      success: true,
      movie: enhancedMovie
    })

  } catch (error) {
    console.error('Failed to fetch movie details:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch movie details', 
        details: error instanceof Error ? error.message : 'Unknown error',
        success: false
      },
      { status: 500 }
    )
  }
}