import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <Card className="max-w-md border-white/10 bg-white/5 backdrop-blur-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 text-6xl font-bold text-violet-400">404</div>
          <CardTitle>Page Not Found</CardTitle>
          <CardDescription>The page you're looking for doesn't exist or has been moved.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Link href="/" className="w-full">
            <Button className="w-full bg-violet-600 hover:bg-violet-700">
              <Home className="mr-2 h-4 w-4" /> Go Home
            </Button>
          </Link>
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
