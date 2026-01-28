import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function StatusCardsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {Array.from({ length: 5 }).map((_, index) => (
        <Card key={index} className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">

              {/* Left content */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <div className="flex items-baseline gap-2">
                  <Skeleton className="h-7 w-20" />
                  <Skeleton className="h-4 w-10" />
                </div>
                <Skeleton className="h-3 w-32" />
              </div>

              {/* Icon */}
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
