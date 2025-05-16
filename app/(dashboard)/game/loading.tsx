import { Skeleton } from "@/components/ui/skeleton"

export default function GameLoading() {
  return (
    <div className="w-full h-screen bg-background-900 flex flex-col items-center justify-center">
      <div className="space-y-4 text-center">
        <h2 className="text-2xl font-bold text-white">Loading Chess Game</h2>
        <div className="flex justify-center">
          <div className="flex space-x-2">
            <div
              className="w-2 h-2 rounded-full bg-everchess-cyan animate-pulse"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2 h-2 rounded-full bg-everchess-cyan animate-pulse"
              style={{ animationDelay: "300ms" }}
            ></div>
            <div
              className="w-2 h-2 rounded-full bg-everchess-cyan animate-pulse"
              style={{ animationDelay: "600ms" }}
            ></div>
          </div>
        </div>
        <div className="w-64 mx-auto space-y-3">
          <Skeleton className="h-4 w-full bg-background-800" />
          <Skeleton className="h-4 w-3/4 bg-background-800" />
          <Skeleton className="h-4 w-5/6 bg-background-800" />
        </div>
      </div>
    </div>
  )
}
