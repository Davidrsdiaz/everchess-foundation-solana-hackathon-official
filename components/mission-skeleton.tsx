import { Skeleton } from "@/components/ui/skeleton"

export function MissionSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-6 rounded-full" />
          <div>
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Skeleton className="h-4 w-16" />
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-3 w-3 rounded-sm transform rotate-45" />
            ))}
          </div>
        </div>
      </div>
      <Skeleton className="h-2 w-full rounded-full" />
    </div>
  )
}
