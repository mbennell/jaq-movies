'use client'

import { useState } from 'react'
import Navigation from '../../components/Navigation'
import Hero from '../../components/Hero'

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
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
      <Navigation isTransparent={true} />
      
      <div style={{ height: '60vh', position: 'relative' }}>
        <Hero />
      </div>
      
      <div className="content-container" style={{ 
        paddingTop: 'var(--spacing-2xl)',
        paddingBottom: 'var(--spacing-2xl)'
      }}>
        <h1 style={{ 
          fontSize: 'var(--font-size-4xl)', 
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '-0.01em',
          textAlign: 'center',
          marginBottom: 'var(--spacing-2xl)',
          color: 'var(--text-primary)'
        }}>
          🔧 Admin Panel
        </h1>
        
        {/* Migration Section */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--bg-secondary)',
          borderRadius: 'var(--border-radius-lg)',
          padding: 'var(--spacing-2xl)',
          marginBottom: 'var(--spacing-2xl)',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <h2 style={{ 
            fontSize: 'var(--font-size-2xl)', 
            fontWeight: '600',
            marginBottom: 'var(--spacing-lg)',
            color: 'var(--text-dark)'
          }}>
            Database Migration
          </h2>
          
          <p style={{ 
            color: 'var(--text-muted)', 
            marginBottom: 'var(--spacing-2xl)',
            lineHeight: '1.6',
            fontSize: 'var(--font-size-base)'
          }}>
            Run this first if imports are failing due to missing database columns.
            This will add any missing fields to the production database.
          </p>
          
          <button 
            onClick={runMigration}
            disabled={migrateStatus === 'loading'}
            style={{
              backgroundColor: migrateStatus === 'loading' ? 'var(--bg-secondary)' : 'var(--warning)',
              color: 'white',
              border: 'none',
              padding: 'var(--spacing-lg) var(--spacing-2xl)',
              fontSize: 'var(--font-size-base)',
              fontWeight: '600',
              borderRadius: 'var(--border-radius)',
              cursor: migrateStatus === 'loading' ? 'not-allowed' : 'pointer',
              marginBottom: 'var(--spacing-lg)',
              transition: 'all var(--transition-normal)'
            }}
            onMouseEnter={(e) => {
              if (migrateStatus !== 'loading') {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
              }
            }}
            onMouseLeave={(e) => {
              if (migrateStatus !== 'loading') {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }
            }}
          >
            {migrateStatus === 'loading' ? 'Migrating...' : 'Run Database Migration'}
          </button>
          
          {migrateStatus === 'success' && migrateResults && (
            <div style={{
              backgroundColor: 'var(--success)',
              color: 'white',
              borderRadius: 'var(--border-radius)',
              padding: 'var(--spacing-lg)'
            }}>
              <h3 style={{ 
                marginBottom: 'var(--spacing-sm)',
                fontSize: 'var(--font-size-lg)',
                fontWeight: '600'
              }}>
                ✅ Migration Successful!
              </h3>
              <p style={{ 
                fontSize: 'var(--font-size-sm)', 
                color: 'rgba(255, 255, 255, 0.9)',
                margin: 0
              }}>
                Database is now ready for imports. Movies: {migrateResults.stats?.movies || 0}, 
                Recommendations: {migrateResults.stats?.recommendations || 0}
              </p>
            </div>
          )}
          
          {migrateStatus === 'error' && (
            <div style={{
              backgroundColor: 'var(--error)',
              color: 'white',
              borderRadius: 'var(--border-radius)',
              padding: 'var(--spacing-lg)'
            }}>
              <h3 style={{ 
                marginBottom: 'var(--spacing-sm)',
                fontSize: 'var(--font-size-lg)',
                fontWeight: '600'
              }}>
                ❌ Migration Failed
              </h3>
              <p style={{ 
                fontSize: 'var(--font-size-sm)', 
                color: 'rgba(255, 255, 255, 0.9)',
                margin: 0
              }}>
                {migrateResults?.error || 'Unknown error occurred'}
              </p>
            </div>
          )}
        </div>
        
        {/* Import Section */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--bg-secondary)',
          borderRadius: 'var(--border-radius-lg)',
          padding: 'var(--spacing-2xl)',
          marginBottom: 'var(--spacing-2xl)',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <h2 style={{ 
            fontSize: 'var(--font-size-2xl)', 
            fontWeight: '600',
            marginBottom: 'var(--spacing-lg)',
            color: 'var(--text-dark)'
          }}>
            Import Jaq&apos;s Collection
          </h2>
          
          <p style={{ 
            color: 'var(--text-muted)', 
            marginBottom: 'var(--spacing-2xl)',
            lineHeight: '1.6',
            fontSize: 'var(--font-size-base)'
          }}>
            This will import all 42 movies/series from Jaq&apos;s Notion collection, 
            enrich them with TMDB data, and add them to the database.
          </p>
          
          <button 
            onClick={runImport}
            disabled={importStatus === 'loading'}
            className="btn btn-primary"
            style={{
              backgroundColor: importStatus === 'loading' ? 'var(--bg-secondary)' : 'var(--accent-primary)',
              padding: 'var(--spacing-lg) var(--spacing-2xl)',
              fontSize: 'var(--font-size-base)',
              fontWeight: '600',
              marginBottom: 'var(--spacing-lg)',
              cursor: importStatus === 'loading' ? 'not-allowed' : 'pointer'
            }}
          >
            {importStatus === 'loading' ? 'Importing...' : 'Import Collection'}
          </button>
          
          {/* Results */}
          {importStatus === 'success' && importResults?.results && (
            <div style={{
              backgroundColor: importResults.results.successful > 0 ? 'var(--success)' : 'var(--warning)',
              color: 'white',
              borderRadius: 'var(--border-radius)',
              padding: 'var(--spacing-lg)'
            }}>
              <h3 style={{ 
                marginBottom: 'var(--spacing-sm)',
                fontSize: 'var(--font-size-lg)',
                fontWeight: '600'
              }}>
                {importResults.results.successful > 0 ? '✅ Import Successful!' : '⚠️ Import Issues'}
              </h3>
              <div style={{ 
                fontSize: 'var(--font-size-sm)', 
                color: 'rgba(255, 255, 255, 0.9)',
                marginBottom: 'var(--spacing-sm)'
              }}>
                <p style={{ margin: '0 0 var(--spacing-xs) 0' }}>Processed: {importResults.results.processed}</p>
                <p style={{ margin: '0 0 var(--spacing-xs) 0' }}>Successful: {importResults.results.successful}</p>
                <p style={{ margin: '0' }}>Failed: {importResults.results.failed}</p>
              </div>
              
              {/* Show errors if any failed */}
              {importResults.results.failed > 0 && importResults.errors && (
                <div style={{ marginTop: 'var(--spacing-md)' }}>
                  <h4 style={{ 
                    marginBottom: 'var(--spacing-sm)',
                    fontSize: 'var(--font-size-base)',
                    fontWeight: '600'
                  }}>
                    Sample Errors:
                  </h4>
                  <div style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    padding: 'var(--spacing-sm)',
                    borderRadius: 'var(--border-radius)',
                    fontSize: 'var(--font-size-xs)',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    fontFamily: 'monospace'
                  }}>
                    {importResults.errors.map((error, index) => (
                      <div key={index} style={{ marginBottom: 'var(--spacing-xs)' }}>
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
              backgroundColor: 'var(--error)',
              color: 'white',
              borderRadius: 'var(--border-radius)',
              padding: 'var(--spacing-lg)'
            }}>
              <h3 style={{ 
                marginBottom: 'var(--spacing-sm)',
                fontSize: 'var(--font-size-lg)',
                fontWeight: '600'
              }}>
                ❌ Import Failed
              </h3>
              <pre style={{ 
                fontSize: 'var(--font-size-xs)', 
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                padding: 'var(--spacing-sm)',
                borderRadius: 'var(--border-radius)',
                overflow: 'auto',
                color: 'rgba(255, 255, 255, 0.9)',
                margin: 0
              }}>
                {JSON.stringify(importResults, null, 2)}
              </pre>
            </div>
          )}
        </div>
        
        {/* Quick Links */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--bg-secondary)',
          borderRadius: 'var(--border-radius-lg)',
          padding: 'var(--spacing-2xl)',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <h2 style={{ 
            fontSize: 'var(--font-size-2xl)', 
            fontWeight: '600',
            marginBottom: 'var(--spacing-lg)',
            color: 'var(--text-dark)'
          }}>
            Quick Links
          </h2>
          
          <div style={{ display: 'flex', gap: 'var(--spacing-lg)', flexWrap: 'wrap' }}>
            <a 
              href="/simple-chat"
              target="_blank"
              className="btn btn-primary"
              style={{
                padding: 'var(--spacing-md) var(--spacing-lg)',
                fontSize: 'var(--font-size-base)',
                fontWeight: '600',
                textDecoration: 'none',
                display: 'inline-block'
              }}
            >
              Test AI Chat
            </a>
            
            <a 
              href="/movies"
              target="_blank"
              style={{
                backgroundColor: 'var(--success)',
                color: 'white',
                padding: 'var(--spacing-md) var(--spacing-lg)',
                textDecoration: 'none',
                borderRadius: 'var(--border-radius)',
                fontSize: 'var(--font-size-base)',
                fontWeight: '600',
                transition: 'all var(--transition-normal)',
                display: 'inline-block'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
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