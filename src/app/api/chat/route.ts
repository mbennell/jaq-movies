import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// For now, we'll create a simple classification system
// Later we can integrate with Claude/OpenAI
function classifyIntent(message: string): 'REQUEST_RECOMMENDATION' | 'SUBMIT_RECOMMENDATION' | 'DISCUSSION' | 'QUESTION' {
  const lowerMessage = message.toLowerCase();
  
  // Intent patterns
  const recommendationSubmissionPatterns = [
    /just watched/i,
    /watched.*and/i,
    /saw.*was/i,
    /finished.*season/i,
    /binged/i,
    /loved/i,
    /hated/i,
    /amazing/i,
    /incredible/i,
    /mind.?blowing/i
  ];
  
  const recommendationRequestPatterns = [
    /what.*should.*watch/i,
    /recommend/i,
    /suggest/i,
    /looking for/i,
    /want.*watch/i,
    /need.*movie/i,
    /feel like/i,
    /mood for/i,
    /tonight/i,
    /weekend/i
  ];
  
  const discussionPatterns = [
    /what.*think/i,
    /opinion/i,
    /thoughts/i,
    /about/i,
    /review/i
  ];
  
  // Check patterns
  for (const pattern of recommendationSubmissionPatterns) {
    if (pattern.test(lowerMessage)) {
      return 'SUBMIT_RECOMMENDATION';
    }
  }
  
  for (const pattern of recommendationRequestPatterns) {
    if (pattern.test(lowerMessage)) {
      return 'REQUEST_RECOMMENDATION';
    }
  }
  
  for (const pattern of discussionPatterns) {
    if (pattern.test(lowerMessage)) {
      return 'DISCUSSION';
    }
  }
  
  return 'QUESTION';
}

function extractMovieTitle(message: string): string | null {
  // Simple extraction - look for quoted titles or common patterns
  const quotedMatch = message.match(/["']([^"']+)["']/);
  if (quotedMatch) {
    return quotedMatch[1];
  }
  
  // Look for "watched X" patterns
  const watchedMatch = message.match(/watched\s+([A-Za-z0-9\s]+?)(?:\s+and|\s+was|\s+is|$)/i);
  if (watchedMatch) {
    return watchedMatch[1].trim();
  }
  
  // Look for "saw X" patterns
  const sawMatch = message.match(/saw\s+([A-Za-z0-9\s]+?)(?:\s+and|\s+was|\s+is|$)/i);
  if (sawMatch) {
    return sawMatch[1].trim();
  }
  
  return null;
}

async function generateResponse(intent: string, message: string, movieTitle?: string) {
  switch (intent) {
    case 'REQUEST_RECOMMENDATION':
      // Get some recommendations from Jaq's collection
      const recommendations = await prisma.recommendation.findMany({
        include: {
          movie: true
        },
        where: {
          recommendedBy: 'jaq'
        },
        orderBy: {
          enthusiasmLevel: 'desc'
        },
        take: 3
      });
      
      if (recommendations.length === 0) {
        return "I don't have any recommendations loaded yet! Try importing Jaq's collection first.";
      }
      
      const topPicks = recommendations.map(rec => 
        `${rec.movie.title} ${rec.jaqNotes ? `(${rec.jaqNotes})` : ''}`
      ).join(', ');
      
      return `Here are some of Jaq's top picks: ${topPicks}. What genre or mood are you in the mood for?`;
    
    case 'SUBMIT_RECOMMENDATION':
      if (movieTitle) {
        return `Nice! "${movieTitle}" sounds interesting. I'll help you add it to the collection. What did you think of it?`;
      }
      return "That's awesome! What movie or series did you watch? I'd love to add it to our collection.";
    
    case 'DISCUSSION':
      return "I'd love to discuss that! What specific movie or series are you thinking about?";
    
    default:
      return "I'm here to help with movie recommendations! You can tell me what you just watched, or ask for suggestions.";
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }
    
    // Classify the intent
    const intent = classifyIntent(message);
    
    // Extract movie title if present
    const movieTitle = extractMovieTitle(message);
    
    // Generate response
    const response = await generateResponse(intent, message, movieTitle || undefined);
    
    // Store conversation
    await prisma.conversation.create({
      data: {
        input: message,
        intent,
        response,
      }
    });
    
    return NextResponse.json({
      response,
      intent,
      movieTitle,
      suggestions: intent === 'REQUEST_RECOMMENDATION' ? await getRecommendations() : null
    });
    
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 });
  }
}

async function getRecommendations(limit = 6) {
  return await prisma.recommendation.findMany({
    include: {
      movie: true
    },
    orderBy: [
      { enthusiasmLevel: 'desc' },
      { createdAt: 'desc' }
    ],
    take: limit
  });
}