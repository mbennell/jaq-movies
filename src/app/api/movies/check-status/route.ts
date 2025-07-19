import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { tmdbIds } = await request.json()
    
    if (!tmdbIds || !Array.isArray(tmdbIds)) {
      return NextResponse.json(
        { success: false, message: 'Valid TMDB IDs array is required' },
        { status: 400 }
      )
    }

    // Check which movies are already in the collection
    const existingMovies = await prisma.movie.findMany({
      where: {
        tmdbId: {
          in: tmdbIds
        }
      },
      select: {
        tmdbId: true,
        title: true
      }
    })

    // Create a map of tmdbId -> exists
    const statusMap = tmdbIds.reduce((acc: Record<number, boolean>, tmdbId: number) => {
      acc[tmdbId] = existingMovies.some(movie => movie.tmdbId === tmdbId)
      return acc
    }, {})

    return NextResponse.json({
      success: true,
      statusMap
    })

  } catch (error) {
    console.error('Failed to check movie status:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to check movie status',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}