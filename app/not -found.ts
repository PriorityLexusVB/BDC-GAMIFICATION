import Link from 'next/link'
import { Car } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-950 via-purple-950/20 to-gray-950">
      <div className="text-center">
        <Car className="mx-auto h-24 w-24 text-purple-500 mb-8" />
        <h1 className="text-4xl font-bold text-white mb-4">404 - Page Not Found</h1>
        <p className="text-gray-400 mb-8">
          Looks like this garage bay is empty. Let's get you back on track!
        </p>
        <Link href="/">
          <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            Return to Garage
          </Button>
        </Link>
      </div>
    </div>
  )
}