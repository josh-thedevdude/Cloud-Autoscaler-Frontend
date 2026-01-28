import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ScalingStatsSkeleton() {
  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="border-border bg-card">
          <CardContent className="p-4 space-y-3">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-7 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
