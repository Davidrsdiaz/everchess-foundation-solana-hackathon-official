import { Skeleton } from "@/components/ui/skeleton"
import { Star, Zap } from "lucide-react"

export default function BattlepassLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-40 bg-background-700" />

      {/* Season 1 Container */}
      <div className="bg-background-700 rounded-lg border border-gray-800 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Star className="h-5 w-5 text-everchess-yellow" />
          <h2 className="text-xl font-bold text-white">Season 1</h2>
        </div>
        <Skeleton className="h-5 w-64 mb-6 bg-background-800" />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-32 bg-background-800" />
            <Skeleton className="h-5 w-24 bg-background-800" />
          </div>

          <Skeleton className="h-2 w-full bg-background-800" />
        </div>

        {/* Free Rewards Row */}
        <div className="mt-8 mb-4">
          <Skeleton className="h-6 w-16 mb-2 bg-background-800" />
          <div className="bg-background-800 rounded-lg p-2">
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={`free-${i}`} className="h-24 w-full bg-background-700 rounded-lg" />
              ))}
            </div>
          </div>
        </div>

        {/* Premium Rewards Row */}
        <div className="mb-6">
          <Skeleton className="h-6 w-24 mb-2 bg-background-800" />
          <div className="bg-background-800 rounded-lg p-2">
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={`premium-${i}`} className="h-24 w-full bg-background-700 rounded-lg" />
              ))}
            </div>
          </div>
        </div>

        <Skeleton className="h-10 w-full mt-4 bg-background-800" />
      </div>

      {/* Missions and Market Containers side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Missions Container */}
        <div className="bg-background-700 rounded-lg border border-gray-800 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-everchess-yellow" />
            <h2 className="text-xl font-bold text-white">Missions</h2>
          </div>
          <Skeleton className="h-5 w-64 mb-4 bg-background-800" />

          <Skeleton className="h-10 w-full mb-4 bg-background-800 rounded-md" />

          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-everchess-yellow/20"></div>
                    <div>
                      <div className="h-4 w-32 bg-background-800 rounded mb-2"></div>
                      <div className="h-3 w-20 bg-background-800 rounded"></div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="h-4 w-16 bg-background-800 rounded"></div>
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((j) => (
                        <div key={j} className="h-3 w-3 bg-background-800 rounded-sm transform rotate-45"></div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="h-2 w-full bg-background-800 rounded-full"></div>
              </div>
            ))}
          </div>

          <Skeleton className="h-10 w-full mt-6 bg-background-800" />
        </div>

        {/* Market Container */}
        <div className="bg-background-700 rounded-lg border border-gray-800 p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-5 w-5 rounded-full bg-everchess-yellow/20"></div>
            <h2 className="text-xl font-bold text-white">Market</h2>
          </div>
          <Skeleton className="h-5 w-64 mb-4 bg-background-800" />

          <div className="flex flex-col gap-4">
            <Skeleton className="h-40 w-full bg-background-800 rounded-lg" />
            <Skeleton className="h-40 w-full bg-background-800 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}
