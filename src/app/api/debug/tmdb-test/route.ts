import { NextResponse } from 'next/server'

export async function GET() {
  const tmdbApiKey = process.env.TMDB_API_KEY?.trim()
  
  console.log('TMDB API Key check:')
  console.log('- Exists:', !!tmdbApiKey)
  console.log('- Length:', tmdbApiKey?.length || 0)
  console.log('- First 10 chars:', tmdbApiKey?.substring(0, 10) || 'N/A')
  
  if (!tmdbApiKey) {
    return NextResponse.json({
      error: 'TMDB API key not found',
      environment: process.env.NODE_ENV,
      hasKey: false
    })
  }

  // Test a simple TMDB API call
  try {
    const tmdbHeaders = {
      'Authorization': `Bearer ${tmdbApiKey}`,
      'Content-Type': 'application/json'
    }

    const testUrl = 'https://api.themoviedb.org/3/search/movie?query=black panther&page=1'
    console.log('Testing TMDB API with URL:', testUrl)
    
    const response = await fetch(testUrl, { headers: tmdbHeaders })
    
    console.log('TMDB API Response:')
    console.log('- Status:', response.status)
    console.log('- OK:', response.ok)
    
    if (!response.ok) {
      return NextResponse.json({
        error: 'TMDB API call failed',
        status: response.status,
        statusText: response.statusText,
        hasKey: true
      })
    }

    const data = await response.json()
    
    return NextResponse.json({
      success: true,
      hasKey: true,
      resultsCount: data.results?.length || 0,
      firstResult: data.results?.[0]?.title || 'None',
      keyLength: tmdbApiKey.length
    })

  } catch (error) {
    console.error('TMDB test error:', error)
    return NextResponse.json({
      error: 'TMDB test failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      hasKey: true
    })
  }
}