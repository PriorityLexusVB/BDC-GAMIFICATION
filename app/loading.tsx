export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-950 via-purple-950/20 to-gray-950">
      <div className="text-center">
        <div className="relative">
          <div className="h-24 w-24 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-16 w-16 animate-pulse rounded-full bg-purple-500/20"></div>
          </div>
        </div>
        <p className="mt-8 text-xl font-semibold text-white animate-pulse">
          Loading Dream Garage...
        </p>
      </div>
    </div>
  )
}