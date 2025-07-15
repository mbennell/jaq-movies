import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import OpenAI from 'openai'

const prisma = new PrismaClient()
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }
    
    // Get some movies from database for context
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
    
    const movieContext = movies.map(movie => ({
      title: movie.title,
      overview: movie.overview || 'No overview',
      rating: movie.rating,
      genres: movie.genres,
      jaqNotes: movie.recommendations[0]?.jaqNotes,
      enthusiasmLevel: movie.recommendations[0]?.enthusiasmLevel
    }))
    
    // Simple OpenAI chat completion
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a movie recommendation assistant for Jaq's curated collection. Here are the available movies with Jaq's ratings:

${JSON.stringify(movieContext, null, 2)}

Help users discover movies from this collection. Be conversational, enthusiastic, and provide specific recommendations based on their requests. Include Jaq's notes when relevant.`
        },
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    })
    
    const aiResponse = response.choices[0]?.message?.content || 'Sorry, I had trouble processing that.'
    
    // Store conversation
    await prisma.conversation.create({
      data: {
        input: message,
        intent: 'REQUEST_RECOMMENDATION',
        response: aiResponse
      }
    })
    
    return NextResponse.json({
      response: aiResponse,
      status: 'completed'
    })
    
  } catch (error) {
    console.error('Simple assistant API error:', error)
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 })
  }
}