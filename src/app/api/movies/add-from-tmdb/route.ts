import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { tmdbId } = await request.json()
    
    if (!tmdbId || typeof tmdbId !== 'number') {
      return NextResponse.json(
        { success: false, message: 'Valid TMDB ID is required' },
        { status: 400 }
      )
    }

    // Check if movie already exists
    const existingMovie = await prisma.movie.findFirst({
      where: { tmdbId: tmdbId }
    })

    if (existingMovie) {
      return NextResponse.json({
        success: false,
        message: 'Movie already in collection',
        movie: existingMovie,
        alreadyExists: true
      })
    }

    // Get TMDB API key
    const tmdbApiKey = process.env.TMDB_API_KEY
    if (!tmdbApiKey) {
      return NextResponse.json(
        { success: false, message: 'TMDB API not configured' },
        { status: 500 }
      )
    }

    // Create headers for TMDB API
    const tmdbHeaders = {
      'Authorization': `Bearer ${tmdbApiKey}`,
      'Content-Type': 'application/json'
    }

    // Fetch movie details from TMDB
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${tmdbId}`,
      { headers: tmdbHeaders }
    )

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: 'Failed to fetch movie details from TMDB' },
        { status: 404 }
      )
    }

    const tmdbMovie = await response.json()

    // Create movie in database
    const newMovie = await prisma.movie.create({
      data: {
        tmdbId: tmdbMovie.id,
        title: tmdbMovie.title,
        originalTitle: tmdbMovie.original_title,
        overview: tmdbMovie.overview || '',
        releaseDate: tmdbMovie.release_date ? new Date(tmdbMovie.release_date) : null,
        runtime: tmdbMovie.runtime || null,
        genres: tmdbMovie.genres?.map((g: { name: string }) => g.name) || [],
        posterPath: tmdbMovie.poster_path || null,
        backdropPath: tmdbMovie.backdrop_path || null,
        rating: tmdbMovie.vote_average || null,
        type: 'MOVIE',
        streamingServices: [],
        aiTags: [],
        moodTags: [],
        contextTags: []
      }
    })

    // Create a discovery recommendation record
    await prisma.recommendation.create({
      data: {
        movieId: newMovie.id,
        recommendedBy: 'discovery',
        status: 'RECOMMENDED',
        enthusiasmLevel: 3,
        personalNote: 'Added from similar movies discovery'
      }
    })

    console.log(`Added new movie to collection: ${newMovie.title} (TMDB ID: ${tmdbId})`)

    return NextResponse.json({
      success: true,
      message: `"${newMovie.title}" added to your collection!`,
      movie: newMovie
    })

  } catch (error) {
    console.error('Failed to add movie from TMDB:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to add movie to collection',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}