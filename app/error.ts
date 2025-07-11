'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-950 via-purple-950/20 to-gray-950">
      <div className="text-center">
        <AlertTriangle className="mx-auto h-24 w-24 text-yellow-500 mb-8" />
        <h1 className="text-4xl font-bold text-white mb-4">Something went wrong!</h1>
        <p className="text-gray-400 mb-8">
          Don't worry, even the best racers hit a bump sometimes.
        </p>
        <Button 
          onClick={reset}
          size="lg" 
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          Try Again
        </Button>
      </div>
    </div>
  )
}