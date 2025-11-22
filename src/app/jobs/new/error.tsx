'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, RefreshCw } from 'lucide-react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to console for debugging
        console.error('Job creation error:', error)
    }, [error])

    // Determine user-friendly error message
    const getUserFriendlyMessage = () => {
        const message = error.message.toLowerCase()

        if (message.includes('openai') || message.includes('api key')) {
            return {
                title: 'AI Service Unavailable',
                description: 'There was an issue connecting to our AI service. This might be due to a configuration issue or temporary service disruption.',
                suggestion: 'Please check that your OpenAI API key is properly configured in .env.local'
            }
        }

        if (message.includes('network') || message.includes('fetch')) {
            return {
                title: 'Network Error',
                description: 'Unable to reach our services. Please check your internet connection.',
                suggestion: 'Try again in a moment'
            }
        }

        if (message.includes('rate limit')) {
            return {
                title: 'Too Many Requests',
                description: 'You have made too many requests in a short time. Please wait a moment before trying again.',
                suggestion: 'Wait 1 minute and try again'
            }
        }

        return {
            title: 'Something Went Wrong',
            description: 'An unexpected error occurred while processing your request.',
            suggestion: 'Try again, or contact support if the issue persists'
        }
    }

    const errorInfo = getUserFriendlyMessage()

    return (
        <div className="container py-10 max-w-2xl">
            <Card className="border-red-500/20 bg-red-500/5">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <AlertCircle className="h-8 w-8 text-red-500" />
                        <div>
                            <CardTitle className="text-red-500">{errorInfo.title}</CardTitle>
                            <CardDescription className="mt-1">
                                {errorInfo.description}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <p className="text-sm text-muted-foreground">
                            <strong>Suggestion:</strong> {errorInfo.suggestion}
                        </p>
                    </div>

                    {process.env.NODE_ENV === 'development' && (
                        <details className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <summary className="text-sm font-medium cursor-pointer">
                                Technical Details (Development Only)
                            </summary>
                            <pre className="mt-2 text-xs text-muted-foreground whitespace-pre-wrap">
                                {error.message}
                            </pre>
                        </details>
                    )}

                    <div className="flex gap-3">
                        <Button
                            onClick={reset}
                            className="flex-1 bg-violet-600 hover:bg-violet-700"
                        >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Try Again
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => window.location.href = '/dashboard'}
                            className="flex-1 border-white/10"
                        >
                            Back to Dashboard
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
