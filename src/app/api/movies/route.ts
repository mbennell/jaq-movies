import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const movies = await prisma.movie.findMany({
      include: {
        recommendations: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform to match the expected interface
    const transformedMovies = movies.map(movie => ({
      id: movie.tmdbId || movie.id,
      title: movie.title,
      overview: movie.overview || '',
      release_date: movie.releaseDate?.toISOString().split('T')[0] || '',
      poster_path: movie.posterPath || '',
      vote_average: movie.rating || 0,
      genre_ids: movie.genres?.map(g => parseInt(g)) || [],
      recommendations: movie.recommendations
    }))

    return NextResponse.json({
      results: transformedMovies,
      total: movies.length
    })

  } catch (error) {
    console.error('Failed to fetch movies:', error)
    return NextResponse.json(
      { error: 'Failed to fetch movies' },
      { status: 500 }
    )
  }
}