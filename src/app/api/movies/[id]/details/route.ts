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

    // Create headers for TMDB API (supports both API key and Bearer token)
    const tmdbHeaders = {
      'Authorization': `Bearer ${tmdbApiKey}`,
      'Content-Type': 'application/json'
    }

    // Fetch detailed movie data from TMDB
    const [movieDetails, credits, watchProviders, videos, recommendations] = await Promise.allSettled([
      fetch(`https://api.themoviedb.org/3/movie/${tmdbId}`, { headers: tmdbHeaders }),
      fetch(`https://api.themoviedb.org/3/movie/${tmdbId}/credits`, { headers: tmdbHeaders }),
      fetch(`https://api.themoviedb.org/3/movie/${tmdbId}/watch/providers`, { headers: tmdbHeaders }),
      fetch(`https://api.themoviedb.org/3/movie/${tmdbId}/videos`, { headers: tmdbHeaders }),
      fetch(`https://api.themoviedb.org/3/movie/${tmdbId}/recommendations`, { headers: tmdbHeaders })
    ])

    let tmdbMovie = null
    let tmdbCredits = null
    let tmdbWatchProviders = null
    let tmdbVideos = null
    let tmdbRecommendations = null

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

    // Parse TMDB videos (trailers)
    if (videos.status === 'fulfilled' && videos.value.ok) {
      tmdbVideos = await videos.value.json()
      console.log('TMDB Videos response:', tmdbVideos)
    } else {
      console.error('Failed to fetch TMDB videos:', videos.status === 'fulfilled' ? videos.value.status : videos.reason)
    }

    // Parse TMDB recommendations
    if (recommendations.status === 'fulfilled' && recommendations.value.ok) {
      tmdbRecommendations = await recommendations.value.json()
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
      streaming_providers: tmdbWatchProviders?.results?.US || null,
      trailers: tmdbVideos?.results?.filter((video: { type: string; site: string }) => 
        video.type === 'Trailer' && video.site === 'YouTube'
      ).slice(0, 3) || [],
      similar_movies: tmdbRecommendations?.results?.slice(0, 8) || []
    }

    console.log('Enhanced movie trailers count:', enhancedMovie.trailers?.length || 0)
    console.log('Enhanced movie similar movies count:', enhancedMovie.similar_movies?.length || 0)

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