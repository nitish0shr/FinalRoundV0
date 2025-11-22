'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('App error:', error)
    }, [error])

    return (
        <div className="container flex min-h-screen flex-col items-center justify-center py-10">
            <Card className="max-w-md border-red-500/30 bg-red-500/5 backdrop-blur-xl">
                <CardHeader>
                    <CardTitle className="text-red-400">Something went wrong!</CardTitle>
                    <CardDescription>
                        An unexpected error occurred. This has been logged and we'll look into it.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <p className="text-sm font-mono text-muted-foreground break-all">
                            {error.message || 'Unknown error'}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button 
                            onClick={reset} 
                            className="flex-1 bg-violet-600 hover:bg-violet-700"
                        >
                            Try again
                        </Button>
                        <Button 
                            variant="outline"
                            onClick={() => window.location.href = '/'}
                            className="flex-1 border-white/10"
                        >
                            Go Home
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
