'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

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
            <Card className="max-w-md border-red-500/20 bg-red-500/5 backdrop-blur-xl">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-500/20 rounded-lg">
                            <AlertCircle className="h-6 w-6 text-red-400" />
                        </div>
                        <div>
                            <CardTitle>Something went wrong!</CardTitle>
                            <CardDescription>An error occurred while loading this page</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground bg-white/5 p-3 rounded-lg font-mono">
                        {error.message || 'Unknown error'}
                    </p>
                    <div className="flex gap-3">
                        <Button 
                            onClick={reset} 
                            className="flex-1 bg-violet-600 hover:bg-violet-700"
                        >
                            Try again
                        </Button>
                        <Button 
                            variant="outline" 
                            className="border-white/10"
                            onClick={() => window.location.href = '/'}
                        >
                            Go Home
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
