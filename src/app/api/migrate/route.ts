import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST() {
  try {
    console.log('Starting database migration...')
    
    // Check if we can connect to the database
    await prisma.$connect()
    console.log('Database connection established')
    
    // Try to add the missing columns if they don't exist
    try {
      await prisma.$executeRaw`
        ALTER TABLE movies 
        ADD COLUMN IF NOT EXISTS "originalTitle" TEXT,
        ADD COLUMN IF NOT EXISTS "aiTags" TEXT[] DEFAULT '{}',
        ADD COLUMN IF NOT EXISTS "moodTags" TEXT[] DEFAULT '{}',
        ADD COLUMN IF NOT EXISTS "contextTags" TEXT[] DEFAULT '{}',
        ADD COLUMN IF NOT EXISTS "complexity" INTEGER;
      `
      console.log('Movie table columns added/updated')
    } catch (error) {
      console.log('Movie table already has required columns or error:', error)
    }
    
    // Check if conversations table exists and add missing columns
    try {
      await prisma.$executeRaw`
        ALTER TABLE conversations 
        ADD COLUMN IF NOT EXISTS "threadId" TEXT,
        ADD COLUMN IF NOT EXISTS "userId" TEXT;
      `
      console.log('Conversation table columns added/updated')
    } catch (error) {
      console.log('Conversation table already has required columns or error:', error)
    }
    
    // Test that we can query the updated schema
    const movieCount = await prisma.movie.count()
    const recommendationCount = await prisma.recommendation.count()
    
    console.log('Migration completed successfully')
    
    return NextResponse.json({
      success: true,
      message: 'Database migration completed',
      stats: {
        movies: movieCount,
        recommendations: recommendationCount
      }
    })
    
  } catch (error) {
    console.error('Migration failed:', error)
    return NextResponse.json({
      success: false,
      error: 'Migration failed',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}