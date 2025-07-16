'use client'

import { useState } from 'react'
import Navigation from '../../components/Navigation'

export default function AdminPage() {
  const [importStatus, setImportStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [importResults, setImportResults] = useState<{
    results?: {
      processed: number;
      successful: number;
      failed: number;
    };
    errors?: string[];
    error?: string;
  } | null>(null)
  const [migrateStatus, setMigrateStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [migrateResults, setMigrateResults] = useState<{
    success?: boolean;
    message?: string;
    stats?: { movies: number; recommendations: number };
    error?: string;
  } | null>(null)

  const runImport = async () => {
    setImportStatus('loading')
    setImportResults(null)

    try {
      const response = await fetch('/api/import/jaq-collection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()
      
      if (response.ok) {
        setImportStatus('success')
        setImportResults(result)
      } else {
        setImportStatus('error')
        setImportResults(result)
      }
    } catch {
      setImportStatus('error')
      setImportResults({ error: 'Failed to import' })
    }
  }

  const runMigration = async () => {
    setMigrateStatus('loading')
    setMigrateResults(null)

    try {
      const response = await fetch('/api/migrate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()
      
      if (response.ok) {
        setMigrateStatus('success')
        setMigrateResults(result)
      } else {
        setMigrateStatus('error')
        setMigrateResults(result)
      }
    } catch {
      setMigrateStatus('error')
      setMigrateResults({ error: 'Failed to migrate' })
    }
  }

  return (
    <div>
      <Navigation />
      
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '2rem' 
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          marginBottom: '2rem',
          textAlign: 'center',
          color: '#333'
        }}>
          🔧 Admin Panel
        </h1>
        
        {/* Migration Section */}
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            marginBottom: '1rem',
            color: '#333'
          }}>
            Database Migration
          </h2>
          
          <p style={{ 
            color: '#666', 
            marginBottom: '2rem',
            lineHeight: '1.6'
          }}>
            Run this first if imports are failing due to missing database columns.
            This will add any missing fields to the production database.
          </p>
          
          <button 
            onClick={runMigration}
            disabled={migrateStatus === 'loading'}
            style={{
              backgroundColor: migrateStatus === 'loading' ? '#ccc' : '#ff9800',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              borderRadius: '8px',
              cursor: migrateStatus === 'loading' ? 'not-allowed' : 'pointer',
              marginBottom: '1rem'
            }}
          >
            {migrateStatus === 'loading' ? 'Migrating...' : 'Run Database Migration'}
          </button>
          
          {migrateStatus === 'success' && migrateResults && (
            <div style={{
              backgroundColor: '#e8f5e8',
              border: '1px solid #4caf50',
              borderRadius: '4px',
              padding: '1rem'
            }}>
              <h3 style={{ color: '#2e7d32', marginBottom: '0.5rem' }}>✅ Migration Successful!</h3>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>
                Database is now ready for imports. Movies: {migrateResults.stats?.movies || 0}, 
                Recommendations: {migrateResults.stats?.recommendations || 0}
              </p>
            </div>
          )}
          
          {migrateStatus === 'error' && (
            <div style={{
              backgroundColor: '#ffe6e6',
              border: '1px solid #f44336',
              borderRadius: '4px',
              padding: '1rem'
            }}>
              <h3 style={{ color: '#c62828', marginBottom: '0.5rem' }}>❌ Migration Failed</h3>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>
                {migrateResults?.error || 'Unknown error occurred'}
              </p>
            </div>
          )}
        </div>
        
        {/* Import Section */}
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            marginBottom: '1rem',
            color: '#333'
          }}>
            Import Jaq&apos;s Collection
          </h2>
          
          <p style={{ 
            color: '#666', 
            marginBottom: '2rem',
            lineHeight: '1.6'
          }}>
            This will import all 42 movies/series from Jaq&apos;s Notion collection, 
            enrich them with TMDB data, and add them to the database.
          </p>
          
          <button 
            onClick={runImport}
            disabled={importStatus === 'loading'}
            style={{
              backgroundColor: importStatus === 'loading' ? '#ccc' : '#0066cc',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              borderRadius: '8px',
              cursor: importStatus === 'loading' ? 'not-allowed' : 'pointer',
              marginBottom: '1rem'
            }}
          >
            {importStatus === 'loading' ? 'Importing...' : 'Import Collection'}
          </button>
          
          {/* Results */}
          {importStatus === 'success' && importResults?.results && (
            <div style={{
              backgroundColor: importResults.results.successful > 0 ? '#e8f5e8' : '#ffe6e6',
              border: `1px solid ${importResults.results.successful > 0 ? '#4caf50' : '#f44336'}`,
              borderRadius: '4px',
              padding: '1rem'
            }}>
              <h3 style={{ 
                color: importResults.results.successful > 0 ? '#2e7d32' : '#c62828', 
                marginBottom: '0.5rem' 
              }}>
                {importResults.results.successful > 0 ? '✅ Import Successful!' : '⚠️ Import Issues'}
              </h3>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>
                <p>Processed: {importResults.results.processed}</p>
                <p>Successful: {importResults.results.successful}</p>
                <p>Failed: {importResults.results.failed}</p>
              </div>
              
              {/* Show errors if any failed */}
              {importResults.results.failed > 0 && importResults.errors && (
                <div style={{ marginTop: '1rem' }}>
                  <h4 style={{ color: '#c62828', marginBottom: '0.5rem' }}>Sample Errors:</h4>
                  <div style={{
                    backgroundColor: '#f5f5f5',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    maxHeight: '200px',
                    overflowY: 'auto'
                  }}>
                    {importResults.errors.map((error, index) => (
                      <div key={index} style={{ marginBottom: '0.25rem' }}>
                        {error}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {importStatus === 'error' && (
            <div style={{
              backgroundColor: '#ffe6e6',
              border: '1px solid #f44336',
              borderRadius: '4px',
              padding: '1rem'
            }}>
              <h3 style={{ color: '#c62828', marginBottom: '0.5rem' }}>❌ Import Failed</h3>
              <pre style={{ 
                fontSize: '0.8rem', 
                backgroundColor: '#f5f5f5',
                padding: '0.5rem',
                borderRadius: '4px',
                overflow: 'auto'
              }}>
                {JSON.stringify(importResults, null, 2)}
              </pre>
            </div>
          )}
        </div>
        
        {/* Quick Links */}
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '2rem'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            marginBottom: '1rem',
            color: '#333'
          }}>
            Quick Links
          </h2>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a 
              href="/simple-chat"
              target="_blank"
              style={{
                backgroundColor: '#0066cc',
                color: 'white',
                padding: '0.75rem 1.5rem',
                textDecoration: 'none',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            >
              Test AI Chat
            </a>
            
            <a 
              href="/movies"
              target="_blank"
              style={{
                backgroundColor: '#28a745',
                color: 'white',
                padding: '0.75rem 1.5rem',
                textDecoration: 'none',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            >
              View Movies Page
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}