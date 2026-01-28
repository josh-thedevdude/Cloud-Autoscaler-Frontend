import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatusCardProps {
  title: string
  value: string
  subtitle?: string
  icon: React.ElementType
  status?: "active" | "paused"
  trend?: {
    value: number
    direction: "up" | "down"
  }
}

export default function StatusCard({
  title,
  value,
  subtitle,
  icon: Icon,
  status = "active",
  trend,
}: StatusCardProps) {
  const statusColors = {
    active: "text-success",
    paused: "text-warning",
  }

  const statusBg = {
    active: "bg-success/10",
    paused: "bg-warning/10",
  }

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-foreground">
                {value}
              </span>
              {trend && (
                <span
                  className={cn(
                    "text-xs font-medium",
                    trend.direction === "up" ? "text-critical" : "text-success"
                  )}
                >
                  {trend.direction === "up" ? "+" : "-"}
                  {trend.value}%
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className={cn("rounded-md p-2", statusBg[status])}>
            <Icon className={cn("h-4 w-4", statusColors[status])} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}