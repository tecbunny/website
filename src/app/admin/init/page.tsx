'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, CheckCircle, XCircle } from 'lucide-react'

export default function InitAdminPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    credentials?: {
      email: string
      password: string
      warning: string
    }
  } | null>(null)

  const initializeAdmin = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/admin/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          initKey: 'init-tecbunny-admin-2024'
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        setResult({
          success: true,
          message: data.message,
          credentials: data.credentials
        })
      } else {
        setResult({
          success: false,
          message: data.error || 'Initialization failed'
        })
      }
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Network error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border border-gray-700 bg-gray-800/50 backdrop-blur">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mb-4 mx-auto">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-semibold text-white">
              Initialize Admin
            </CardTitle>
            <CardDescription className="text-gray-400">
              Create the default admin account for TecBunny
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {result && (
              <Alert className={result.success ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10"}>
                {result.success ? (
                  <CheckCircle className="h-4 w-4 text-green-400" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-400" />
                )}
                <AlertDescription className={result.success ? "text-green-400" : "text-red-400"}>
                  {result.message}
                </AlertDescription>
              </Alert>
            )}

            {result?.success && result.credentials && (
              <div className="space-y-3 p-4 bg-gray-700/50 rounded-lg">
                <h3 className="text-white font-semibold">Admin Credentials:</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-400">Email: </span>
                    <span className="text-green-400 font-mono">{result.credentials.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Password: </span>
                    <span className="text-green-400 font-mono">{result.credentials.password}</span>
                  </div>
                  <div className="text-yellow-400 text-xs mt-2">
                    ⚠️ {result.credentials.warning}
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={initializeAdmin}
              disabled={isLoading || result?.success}
              className="w-full h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium"
            >
              {isLoading ? 'Initializing...' : result?.success ? 'Admin Created' : 'Initialize Admin'}
            </Button>

            {result?.success && (
              <div className="pt-4">
                <Button
                  onClick={() => window.location.href = '/admin/login'}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Go to Admin Login
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
