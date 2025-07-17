import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; movieId: string }> }
) {
  try {
    const { userId, movieId } = await params
    
    console.log(`Fetching user action for userId: "${userId}", movieId: "${movieId}"`)
    
    // First check if the movie exists to get the correct internal ID
    const movie = await prisma.movie.findFirst({
      where: {
        OR: [
          { id: movieId },
          { tmdbId: parseInt(movieId) }
        ]
      }
    })

    if (!movie) {
      console.log(`Movie not found for ID: ${movieId}`)
      return NextResponse.json({
        success: true,
        userAction: {
          rating: null,
          isWatchlisted: false,
          isWatched: false,
          personalNotes: null
        }
      })
    }

    // Find user action using the internal movie ID
    const userAction = await prisma.userAction.findUnique({
      where: {
        userId_movieId: {
          userId: userId,
          movieId: movie.id
        }
      }
    })

    console.log(`User action found:`, userAction ? 'Yes' : 'No')

    return NextResponse.json({
      success: true,
      userAction: userAction || {
        rating: null,
        isWatchlisted: false,
        isWatched: false,
        personalNotes: null
      }
    })

  } catch (error) {
    console.error('Failed to fetch user action:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch user action', 
        details: error instanceof Error ? error.message : 'Unknown error',
        success: false
      },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; movieId: string }> }
) {
  try {
    const { userId, movieId } = await params
    const body = await request.json()
    
    const { rating, isWatchlisted, isWatched, personalNotes } = body
    
    // Validate rating if provided
    if (rating !== null && rating !== undefined && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5', success: false },
        { status: 400 }
      )
    }

    // Check if movie exists
    const movie = await prisma.movie.findFirst({
      where: {
        OR: [
          { id: movieId },
          { tmdbId: parseInt(movieId) }
        ]
      }
    })

    if (!movie) {
      return NextResponse.json(
        { error: 'Movie not found', success: false },
        { status: 404 }
      )
    }

    // Upsert user action (create or update)
    const userAction = await prisma.userAction.upsert({
      where: {
        userId_movieId: {
          userId: userId,
          movieId: movie.id
        }
      },
      update: {
        rating: rating,
        isWatchlisted: isWatchlisted ?? false,
        isWatched: isWatched ?? false,
        personalNotes: personalNotes,
        updatedAt: new Date()
      },
      create: {
        userId: userId,
        movieId: movie.id,
        rating: rating,
        isWatchlisted: isWatchlisted ?? false,
        isWatched: isWatched ?? false,
        personalNotes: personalNotes
      }
    })

    console.log(`User action saved for ${userId} on movie ${movie.title}:`, {
      rating: userAction.rating,
      isWatchlisted: userAction.isWatchlisted,
      isWatched: userAction.isWatched
    })

    return NextResponse.json({
      success: true,
      message: 'User action saved successfully',
      userAction: userAction
    })

  } catch (error) {
    console.error('Failed to save user action:', error)
    return NextResponse.json(
      { 
        error: 'Failed to save user action', 
        details: error instanceof Error ? error.message : 'Unknown error',
        success: false
      },
      { status: 500 }
    )
  }
}