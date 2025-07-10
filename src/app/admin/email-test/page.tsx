'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, Mail } from 'lucide-react'

export default function EmailTestPage() {
  const [testEmail, setTestEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const [configTest, setConfigTest] = useState<{ success: boolean; message: string } | null>(null)

  const testEmailConfig = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/email')
      const data = await response.json()
      setConfigTest(data)
    } catch {
      setConfigTest({
        success: false,
        message: 'Failed to test email configuration'
      })
    }
    setIsLoading(false)
  }

  const sendTestEmail = async (type: string) => {
    if (!testEmail) {
      setResult({
        success: false,
        message: 'Please enter an email address'
      })
      return
    }

    setIsLoading(true)
    try {
      const emailData = {
        welcome: {
          type: 'welcome',
          to: testEmail,
          data: { name: 'Test User' }
        },
        orderConfirmation: {
          type: 'order-confirmation',
          to: testEmail,
          data: {
            orderId: 'TB123456789',
            customerName: 'Test User',
            total: '2499'
          }
        },
        passwordReset: {
          type: 'password-reset',
          to: testEmail,
          data: {
            resetLink: 'https://tecbunny.com/reset-password?token=test123',
            name: 'Test User'
          }
        }
      }

      const response = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData[type as keyof typeof emailData]),
      })

      const data = await response.json()
      setResult(data)
    } catch {
      setResult({
        success: false,
        message: 'Failed to send test email'
      })
    }
    setIsLoading(false)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Email Configuration Test</h1>
        <p className="text-gray-600">Test your email configuration and send sample emails.</p>
      </div>

      {/* Email Configuration Test */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Configuration Test
          </CardTitle>
          <CardDescription>
            Test if your SMTP configuration is working correctly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={testEmailConfig} 
            disabled={isLoading}
            className="mb-4"
          >
            {isLoading ? 'Testing...' : 'Test Email Configuration'}
          </Button>

          {configTest && (
            <Alert className={configTest.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              {configTest.success ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <AlertDescription className={configTest.success ? 'text-green-700' : 'text-red-700'}>
                {configTest.message}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Send Test Emails */}
      <Card>
        <CardHeader>
          <CardTitle>Send Test Emails</CardTitle>
          <CardDescription>
            Send sample emails to test different email templates.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="testEmail">Test Email Address</Label>
            <Input
              id="testEmail"
              type="email"
              placeholder="Enter email address to receive test emails"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button 
              variant="outline"
              onClick={() => sendTestEmail('welcome')}
              disabled={isLoading || !testEmail}
            >
              Welcome Email
            </Button>
            <Button 
              variant="outline"
              onClick={() => sendTestEmail('orderConfirmation')}
              disabled={isLoading || !testEmail}
            >
              Order Confirmation
            </Button>
            <Button 
              variant="outline"
              onClick={() => sendTestEmail('passwordReset')}
              disabled={isLoading || !testEmail}
            >
              Password Reset
            </Button>
          </div>

          {result && (
            <Alert className={result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              {result.success ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <AlertDescription className={result.success ? 'text-green-700' : 'text-red-700'}>
                {result.message}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Configuration Guide */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Email Configuration Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Gmail Setup:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
              <li>Enable 2-factor authentication on your Gmail account</li>
              <li>Generate an App Password (not your regular password)</li>
              <li>Use smtp.gmail.com as SMTP host, port 587</li>
              <li>Set SMTP_SECURE=false in your .env.local</li>
            </ol>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Environment Variables:</h4>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`EMAIL_FROM=noreply@tecbunny.com
EMAIL_FROM_NAME=TecBunny
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
