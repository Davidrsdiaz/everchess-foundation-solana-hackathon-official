import { Skeleton } from "@/components/ui/skeleton"

export default function RankingLoading() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Skeleton className="h-8 w-48 bg-background-800" />
          <Skeleton className="h-4 w-64 mt-2 bg-background-800" />
        </div>
        <Skeleton className="h-10 w-32 bg-background-800" />
      </div>

      <Skeleton className="h-12 w-full bg-background-800" />

      <div className="bg-background-900 rounded-lg p-6">
        <div className="mb-4">
          <Skeleton className="h-6 w-48 bg-background-800" />
          <Skeleton className="h-4 w-64 mt-2 bg-background-800" />
        </div>

        <div className="space-y-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full bg-background-800" />
          ))}
        </div>

        <div className="mt-6">
          <Skeleton className="h-10 w-full bg-background-800" />
        </div>
      </div>

      <div className="bg-background-900 rounded-lg p-6">
        <div className="mb-4">
          <Skeleton className="h-6 w-48 bg-background-800" />
          <Skeleton className="h-4 w-64 mt-2 bg-background-800" />
        </div>

        <Skeleton className="h-64 w-full bg-background-800" />

        <div className="mt-6">
          <Skeleton className="h-10 w-full bg-background-800" />
        </div>
      </div>
    </div>
  )
}
