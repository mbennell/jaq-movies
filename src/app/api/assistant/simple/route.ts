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
      return NextResponse.json({ 
        error: 'Message is required',
        response: 'Please provide a message to get movie recommendations.',
        status: 'error'
      }, { status: 200 })
    }

    console.log('Processing message:', message)
    
    // Check if OpenAI is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        error: 'OpenAI not configured',
        response: 'AI chat is not available right now. Please try the basic movie browsing instead.',
        status: 'error'
      }, { status: 200 })
    }
    
    // Get some movies from database for context
    let movieContext = []
    try {
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
      
      movieContext = movies.map(movie => ({
        title: movie.title,
        overview: movie.overview || 'No overview',
        rating: movie.rating,
        genres: movie.genres,
        jaqNotes: movie.recommendations[0]?.jaqNotes,
        enthusiasmLevel: movie.recommendations[0]?.enthusiasmLevel
      }))
      
      console.log(`Found ${movies.length} movies in database`)
      
      if (movies.length === 0) {
        return NextResponse.json({
          response: "I don't have any movies loaded yet! Please go to the Admin panel and import Jaq's collection first.",
          status: 'completed'
        })
      }
    } catch (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json({
        response: "I'm having trouble accessing the movie database. Please try again later or check the Admin panel.",
        status: 'error'
      }, { status: 200 })
    }
    
    // Simple OpenAI chat completion
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a movie recommendation assistant for Jaq's curated collection. Here are the available movies with Jaq's ratings (showing first 10):

${JSON.stringify(movieContext.slice(0, 5), null, 2)}

Help users discover movies from this collection. Be conversational, enthusiastic, and provide specific recommendations based on their requests. Include Jaq's notes when relevant. Keep responses under 200 words.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 300
      })
      
      const aiResponse = response.choices[0]?.message?.content || 'Sorry, I had trouble processing that.'
      console.log('OpenAI response received')
      
      // Store conversation
      try {
        await prisma.conversation.create({
          data: {
            input: message,
            intent: 'REQUEST_RECOMMENDATION',
            response: aiResponse
          }
        })
      } catch (dbError) {
        console.warn('Failed to store conversation:', dbError)
        // Continue anyway
      }
      
      return NextResponse.json({
        response: aiResponse,
        status: 'completed'
      })
      
    } catch (openaiError) {
      console.error('OpenAI API error:', openaiError)
      return NextResponse.json({
        response: "I'm having trouble with the AI right now. You can still browse movies in the Movies section!",
        status: 'error'
      }, { status: 200 })
    }
    
  } catch (error) {
    console.error('Simple assistant API error:', error)
    return NextResponse.json({ 
      error: 'Failed to process message',
      response: 'Something went wrong. Please try again or browse movies manually.',
      status: 'error'
    }, { status: 200 })
  }
}