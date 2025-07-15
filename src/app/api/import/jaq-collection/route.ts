import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

interface JaqMovie {
  title: string;
  type: 'MOVIE' | 'SERIES';
  status: 'RECOMMENDED' | 'WATCHING' | 'COMPLETED';
  enthusiasmLevel: number;
  jaqNotes?: string;
  recommendedBy: string;
}

async function searchTMDB(title: string, type: 'MOVIE' | 'SERIES') {
  const endpoint = type === 'MOVIE' ? 'search/movie' : 'search/tv';
  
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/${endpoint}?query=${encodeURIComponent(title)}`,
      {
        headers: {
          'Authorization': `Bearer ${TMDB_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = await response.json();
    return data.results[0] || null; // Return first match
  } catch (error) {
    console.error(`TMDB search failed for "${title}":`, error);
    return null;
  }
}

export async function POST() {
  try {
    // Load the parsed collection
    const fs = require('fs');
    const path = require('path');
    const jaqCollectionPath = path.join(process.cwd(), 'scripts', 'jaq-collection.json');
    const jaqCollection: JaqMovie[] = JSON.parse(fs.readFileSync(jaqCollectionPath, 'utf-8'));
    
    const results = {
      processed: 0,
      successful: 0,
      failed: 0,
      errors: [] as string[]
    };

    for (const item of jaqCollection) {
      results.processed++;
      
      try {
        // Search TMDB for the movie/series
        const tmdbData = await searchTMDB(item.title, item.type);
        
        let movieData;
        if (tmdbData) {
          // Create movie with TMDB data
          movieData = await prisma.movie.create({
            data: {
              title: tmdbData.title || tmdbData.name,
              originalTitle: item.title, // Keep Jaq's original title
              tmdbId: tmdbData.id,
              overview: tmdbData.overview,
              releaseDate: tmdbData.release_date || tmdbData.first_air_date ? 
                new Date(tmdbData.release_date || tmdbData.first_air_date) : null,
              posterPath: tmdbData.poster_path,
              backdropPath: tmdbData.backdrop_path,
              rating: tmdbData.vote_average,
              genres: tmdbData.genre_ids?.map((id: number) => id.toString()) || [],
              type: item.type,
            }
          });
        } else {
          // Create movie without TMDB data
          movieData = await prisma.movie.create({
            data: {
              title: item.title,
              originalTitle: item.title,
              type: item.type,
            }
          });
        }

        // Create recommendation
        await prisma.recommendation.create({
          data: {
            movieId: movieData.id,
            recommendedBy: item.recommendedBy,
            status: item.status,
            jaqNotes: item.jaqNotes,
            enthusiasmLevel: item.enthusiasmLevel,
          }
        });

        results.successful++;
        console.log(`✅ Imported: ${item.title}`);
        
        // Add small delay to be nice to TMDB API
        await new Promise(resolve => setTimeout(resolve, 250));
        
      } catch (error) {
        results.failed++;
        const errorMsg = `Failed to import "${item.title}": ${error}`;
        results.errors.push(errorMsg);
        console.error(errorMsg);
      }
    }

    return NextResponse.json({
      message: 'Import completed',
      results
    });

  } catch (error) {
    console.error('Import failed:', error);
    return NextResponse.json(
      { error: 'Import failed', details: error },
      { status: 500 }
    );
  }
}