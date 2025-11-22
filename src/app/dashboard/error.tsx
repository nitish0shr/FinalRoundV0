'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Home, RefreshCw } from 'lucide-react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('Dashboard error:', error)
    }, [error])

    return (
        <div className="container py-20">
            <Card className="max-w-2xl mx-auto border-red-500/20 bg-red-500/5">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <AlertCircle className="h-8 w-8 text-red-500" />
                        <div>
                            <CardTitle className="text-red-500">Dashboard Error</CardTitle>
                            <CardDescription className="mt-1">
                                We encountered an issue loading your dashboard
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        This might be a temporary issue. Try refreshing the page, or go back to the home page.
                    </p>

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
                            onClick={() => window.location.href = '/'}
                            className="flex-1 border-white/10"
                        >
                            <Home className="mr-2 h-4 w-4" />
                            Go Home
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
