import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

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
    console.log('Starting import process...');
    
    // Load the parsed collection
    const jaqCollectionPath = path.join(process.cwd(), 'scripts', 'jaq-collection.json');
    console.log('Looking for collection at:', jaqCollectionPath);
    
    if (!fs.existsSync(jaqCollectionPath)) {
      throw new Error(`Collection file not found at ${jaqCollectionPath}`);
    }
    
    const jaqCollection: JaqMovie[] = JSON.parse(fs.readFileSync(jaqCollectionPath, 'utf-8'));
    console.log(`Loaded ${jaqCollection.length} movies from collection`);
    
    // Check TMDB API key
    if (!TMDB_API_KEY) {
      console.warn('TMDB API key not found, will create movies without metadata');
    }
    
    const results = {
      processed: 0,
      successful: 0,
      failed: 0,
      errors: [] as string[]
    };

    for (const item of jaqCollection) {
      results.processed++;
      console.log(`Processing ${results.processed}/${jaqCollection.length}: ${item.title}`);
      
      try {
        // Search TMDB for the movie/series
        let tmdbData = null;
        if (TMDB_API_KEY) {
          tmdbData = await searchTMDB(item.title, item.type);
          console.log(`TMDB lookup for "${item.title}":`, tmdbData ? 'Found' : 'Not found');
        }
        
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
              type: item.type === 'SERIES' ? 'TV_SHOW' : item.type,
            }
          });
        } else {
          // Create movie without TMDB data
          movieData = await prisma.movie.create({
            data: {
              title: item.title,
              originalTitle: item.title,
              type: item.type === 'SERIES' ? 'TV_SHOW' : item.type,
            }
          });
        }

        console.log(`Created movie: ${movieData.id}`);

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
        if (TMDB_API_KEY) {
          await new Promise(resolve => setTimeout(resolve, 250));
        }
        
      } catch (error) {
        results.failed++;
        const errorMsg = `Failed to import "${item.title}": ${error instanceof Error ? error.message : String(error)}`;
        results.errors.push(errorMsg);
        console.error(`❌ ${errorMsg}`);
        console.error('Full error:', error);
      }
    }

    console.log('Import completed:', results);
    
    return NextResponse.json({
      message: 'Import completed',
      results,
      // Include errors in response for debugging
      errors: results.errors.slice(0, 5) // Show first 5 errors
    });

  } catch (error) {
    console.error('Import failed:', error);
    return NextResponse.json(
      { error: 'Import failed', details: error },
      { status: 500 }
    );
  }
}