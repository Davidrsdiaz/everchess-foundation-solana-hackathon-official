import { Skeleton } from "@/components/ui/skeleton"

export default function MarketLoading() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Skeleton className="h-8 w-48 bg-background-800" />
          <Skeleton className="h-4 w-64 mt-2 bg-background-800" />
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Skeleton className="h-10 w-full sm:w-64 bg-background-800" />
          <Skeleton className="h-10 w-32 bg-background-800" />
        </div>
      </div>

      <Skeleton className="h-12 w-full bg-background-800" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-96 w-full bg-background-800 rounded-lg" />
        ))}
      </div>

      <div className="bg-background-900 rounded-lg p-6">
        <div className="mb-6">
          <Skeleton className="h-6 w-48 bg-background-800" />
          <Skeleton className="h-4 w-64 mt-2 bg-background-800" />
        </div>

        <Skeleton className="h-32 w-full bg-background-800 rounded-lg" />
      </div>
    </div>
  )
}
