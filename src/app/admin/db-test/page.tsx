'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, Database, Play } from 'lucide-react'

export default function DatabaseTestPage() {
  const [testResult, setTestResult] = useState<{ success: boolean, message?: string, error?: string, details?: string } | null>(null)
  const [initResult, setInitResult] = useState<{ success: boolean, message?: string, error?: string, details?: string, instructions?: string[], credentials?: { email: string, password: string, warning: string } } | null>(null)
  const [loading, setLoading] = useState(false)

  const testDatabase = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/init-db', { method: 'GET' })
      const data = await response.json()
      setTestResult(data)
    } catch (error) {
      setTestResult({ 
        success: false, 
        error: 'Network error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      })
    } finally {
      setLoading(false)
    }
  }

  const initDatabase = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/init-db', { method: 'POST' })
      const data = await response.json()
      setInitResult(data)
    } catch (error) {
      setInitResult({ 
        success: false, 
        error: 'Network error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Database Test</h1>
        <p className="text-gray-600">Test and initialize your database schema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Test Connection
            </CardTitle>
            <CardDescription>
              Check if database connection is working
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={testDatabase} 
              disabled={loading}
              className="w-full mb-4"
            >
              <Play className="h-4 w-4 mr-2" />
              Test Database
            </Button>
            
            {testResult && (
              <Alert className={testResult.success ? "border-green-500" : "border-red-500"}>
                <div className="flex items-center gap-2">
                  {testResult.success ? 
                    <CheckCircle className="h-4 w-4 text-green-500" /> : 
                    <XCircle className="h-4 w-4 text-red-500" />
                  }
                  <AlertDescription>
                    <div className="font-medium">{testResult.message || testResult.error}</div>
                    {testResult.details && (
                      <div className="text-sm mt-1 text-gray-600">
                        {testResult.details}
                      </div>
                    )}
                  </AlertDescription>
                </div>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Initialize Database
            </CardTitle>
            <CardDescription>
              Create tables and admin user
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={initDatabase} 
              disabled={loading}
              className="w-full mb-4"
            >
              <Play className="h-4 w-4 mr-2" />
              Initialize Database
            </Button>
            
            {initResult && (
              <Alert className={initResult.success ? "border-green-500" : "border-red-500"}>
                <div className="flex items-center gap-2">
                  {initResult.success ? 
                    <CheckCircle className="h-4 w-4 text-green-500" /> : 
                    <XCircle className="h-4 w-4 text-red-500" />
                  }
                  <AlertDescription>
                    <div className="font-medium">{initResult.message || initResult.error}</div>
                    {initResult.details && (
                      <div className="text-sm mt-1 text-gray-600">
                        {initResult.details}
                      </div>
                    )}
                    {initResult.credentials && (
                      <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                        <div className="font-medium text-yellow-800">Admin Credentials Created:</div>
                        <div className="text-sm text-yellow-700">
                          Email: {initResult.credentials.email}<br />
                          Password: {initResult.credentials.password}
                        </div>
                        <div className="text-xs text-yellow-600 mt-1">
                          {initResult.credentials.warning}
                        </div>
                      </div>
                    )}
                    {initResult.instructions && (
                      <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                        <div className="font-medium text-blue-800">Instructions:</div>
                        <ul className="text-sm text-blue-700 mt-1">
                          {initResult.instructions.map((instruction: string, index: number) => (
                            <li key={index}>{instruction}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </AlertDescription>
                </div>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Database Schema SQL</CardTitle>
          <CardDescription>
            Copy and run this SQL in your Supabase SQL Editor if initialization fails
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto">
            <div className="text-gray-600 mb-2">File: /lib/database-schema.sql</div>
            <div className="text-blue-600">
              Go to your Supabase dashboard → SQL Editor → Copy and run the SQL from the database-schema.sql file
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
