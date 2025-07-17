import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function DELETE(
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
      }
    })

    if (!movie) {
      return NextResponse.json(
        { error: 'Movie not found', success: false },
        { status: 404 }
      )
    }

    // Delete the movie (this will cascade delete recommendations and user actions)
    await prisma.movie.delete({
      where: {
        id: movie.id
      }
    })

    console.log(`Successfully deleted movie: ${movie.title} (ID: ${movie.id})`)

    return NextResponse.json({
      success: true,
      message: `"${movie.title}" has been removed from your collection`,
      deletedMovie: {
        id: movie.id,
        title: movie.title
      }
    })

  } catch (error) {
    console.error('Failed to delete movie:', error)
    return NextResponse.json(
      { 
        error: 'Failed to delete movie from collection', 
        details: error instanceof Error ? error.message : 'Unknown error',
        success: false
      },
      { status: 500 }
    )
  }
}