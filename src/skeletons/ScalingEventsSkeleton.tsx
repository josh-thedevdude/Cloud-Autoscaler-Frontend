import { Skeleton } from "@/components/ui/skeleton"
import { CardContent } from "@/components/ui/card"

export function ScalingEventsSkeleton() {
  return (
    <CardContent>
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="relative rounded-lg border p-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

              {/* Left section */}
              <div className="flex items-center gap-3">
                {/* Icon */}
                <Skeleton className="h-8 w-8 rounded-md" />

                {/* Text block */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-20 rounded-full" />
                  </div>

                  <Skeleton className="h-4 w-48" />
                </div>
              </div>

              {/* Right section */}
              <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  )
}
