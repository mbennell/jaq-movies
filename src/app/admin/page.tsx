'use client'

import { useState } from 'react'
import { Button, Card, CardBody, Chip } from '@heroui/react'

export default function AdminPage() {
  const [importStatus, setImportStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [importResults, setImportResults] = useState<{
    results?: {
      processed: number;
      successful: number;
      failed: number;
    };
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
    } catch (_) {
      setImportStatus('error')
      setImportResults({ error: 'Failed to import' })
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-8">Admin Panel</h1>
        
        <Card className="bg-background/60 backdrop-blur-md border-primary/30 mb-6">
          <CardBody className="p-8">
            <h2 className="text-xl font-semibold mb-4">Import Jaq&apos;s Collection</h2>
            <p className="text-foreground/80 mb-6">
              This will import all 42 movies/series from Jaq&apos;s Notion collection, 
              enrich them with TMDB data, and add them to the database.
            </p>
            
            <Button 
              color="primary" 
              onClick={runImport}
              disabled={importStatus === 'loading'}
              className="mb-4"
            >
              {importStatus === 'loading' ? 'Importing...' : 'Import Collection'}
            </Button>
            
            {importStatus === 'success' && (
              <div className="space-y-2">
                <Chip color="success">Import Successful!</Chip>
                {importResults?.results && (
                  <div className="text-sm space-y-1">
                    <p>Processed: {importResults.results.processed}</p>
                    <p>Successful: {importResults.results.successful}</p>
                    <p>Failed: {importResults.results.failed}</p>
                  </div>
                )}
              </div>
            )}
            
            {importStatus === 'error' && (
              <div className="space-y-2">
                <Chip color="danger">Import Failed</Chip>
                <pre className="text-sm bg-danger/10 p-2 rounded">
                  {JSON.stringify(importResults, null, 2)}
                </pre>
              </div>
            )}
          </CardBody>
        </Card>
        
        <Card className="bg-background/60 backdrop-blur-md border-primary/30">
          <CardBody className="p-8">
            <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
            <div className="space-y-2">
              <Button 
                variant="ghost" 
                onClick={() => window.open('/chat', '_blank')}
              >
                Test Chat Interface
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => window.open('/movies', '_blank')}
              >
                View Movies Page
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}