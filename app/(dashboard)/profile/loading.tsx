import { Skeleton } from "@/components/ui/skeleton"

export default function ProfileLoading() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Skeleton className="h-10 w-48 bg-background-800" />
          <Skeleton className="h-5 w-64 mt-2 bg-background-800" />
        </div>
        <Skeleton className="h-10 w-32 bg-background-800" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="h-[450px] w-full bg-background-800" />
        <Skeleton className="h-[450px] w-full lg:col-span-2 bg-background-800" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-80 w-full bg-background-800" />
        <Skeleton className="h-80 w-full bg-background-800" />
      </div>

      <Skeleton className="h-64 w-full bg-background-800" />
    </div>
  )
}
