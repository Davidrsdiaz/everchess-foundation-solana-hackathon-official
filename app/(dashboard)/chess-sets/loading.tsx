import { Skeleton } from "@/components/ui/skeleton"

export default function ChessSetsLoading() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Skeleton className="h-10 w-64 mb-2 bg-gray-800" />
      <Skeleton className="h-6 w-96 mb-8 bg-gray-800" />

      <Skeleton className="h-12 w-full mb-8 bg-gray-800" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="flex flex-col items-center rounded-lg border border-gray-800 p-6 bg-gray-900">
              <Skeleton className="h-24 w-24 rounded-full mb-4 bg-gray-800" />
              <Skeleton className="h-8 w-48 mb-2 bg-gray-800" />
              <Skeleton className="h-5 w-20 mb-3 bg-gray-800" />
              <Skeleton className="h-4 w-full mb-2 bg-gray-800" />
              <Skeleton className="h-4 w-5/6 mb-6 bg-gray-800" />
              <div className="flex gap-3 w-full">
                <Skeleton className="h-10 flex-1 bg-gray-800" />
                <Skeleton className="h-10 flex-1 bg-gray-800" />
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
