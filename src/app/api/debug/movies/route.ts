import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const movies = await prisma.movie.findMany({
      include: {
        recommendations: {
          where: { recommendedBy: 'jaq' }
        }
      },
      take: 50
    })

    const movieDetails = movies.map(movie => ({
      id: movie.id,
      title: movie.title,
      originalTitle: movie.originalTitle,
      type: movie.type,
      genres: movie.genres,
      overview: movie.overview?.substring(0, 200) + '...',
      rating: movie.rating,
      tmdbId: movie.tmdbId,
      jaqNotes: movie.recommendations[0]?.jaqNotes,
      enthusiasmLevel: movie.recommendations[0]?.enthusiasmLevel
    }))

    // Group by potential sci-fi indicators
    const sciFiMovies = movies.filter(movie => 
      movie.genres?.some(genre => 
        genre === '878' || // TMDB sci-fi genre ID
        genre.toLowerCase().includes('sci') ||
        genre.toLowerCase().includes('science')
      ) ||
      movie.overview?.toLowerCase().includes('space') ||
      movie.overview?.toLowerCase().includes('future') ||
      movie.overview?.toLowerCase().includes('alien') ||
      movie.overview?.toLowerCase().includes('technology') ||
      movie.title.toLowerCase().includes('inception') ||
      movie.title.toLowerCase().includes('interstellar') ||
      movie.title.toLowerCase().includes('matrix')
    )

    return NextResponse.json({
      total: movies.length,
      movies: movieDetails,
      sciFiCandidates: sciFiMovies.length,
      sciFiMovies: sciFiMovies.map(m => ({
        title: m.title,
        genres: m.genres,
        overview: m.overview?.substring(0, 100)
      })),
      genreAnalysis: {
        availableGenres: Array.from(new Set(movies.flatMap(m => m.genres || []))),
        moviesWithGenres: movies.filter(m => m.genres && m.genres.length > 0).length,
        moviesWithOverview: movies.filter(m => m.overview).length
      }
    })

  } catch (error) {
    console.error('Debug API error:', error)
    return NextResponse.json({
      error: 'Failed to fetch debug info',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}