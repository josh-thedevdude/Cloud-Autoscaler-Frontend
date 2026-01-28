import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  Server,
  Cpu,
  TrendingUp,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { Navigate, useParams } from "react-router"
import { useQuery } from "@tanstack/react-query"
import { formatDateTime, formatTitleFromSnakeCase } from "@/lib/formatter"
import { getClusterScalingEvents, getScalingStats } from "@/api/metrics"
import ScalingStatsSkeleton from "@/skeletons/ScalingStatsSkeleton"
import ErrorPage from "./ErrorPage"
import { ScalingEventsSkeleton } from "@/skeletons/ScalingEventsSkeleton"

const typeConfig = {
  "SCALE_UP": {
    icon: ArrowUp,
    label: "Scale Up",
    color: "text-chart-1",
    bg: "bg-chart-1/10",
    border: "border-chart-1/30",
    badge: "bg-chart-1/10 text-chart-1 border-chart-1/30",
  },
  "SCALE_DOWN": {
    icon: ArrowDown,
    label: "Scale Down",
    color: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/30",
    badge: "bg-warning/10 text-warning border-warning/30",
  },
  "EMERGENCY": {
    icon: AlertTriangle,
    label: "Emergency",
    color: "text-critical",
    bg: "bg-critical/10",
    border: "border-critical/30",
    badge: "bg-critical/10 text-critical border-critical/30",
  },
}

const triggerConfig = {
  cpu: {
    icon: Cpu,
    label: "CPU",
    actions: [
      "cpu_critical",
      "sustained_high_cpu",
      "sustained_low_cpu",
      "low_cpu_stable_or_falling",
    ],
  },

  prediction: {
    icon: TrendingUp,
    label: "Prediction",
    actions: [
      "spike_detected",
      "predicted_spike_proactive",
      "warning_rising_trend",
      "sustained_high_rising",
    ],
  },

  manual: {
    icon: Server,
    label: "Manual",
    actions: [""], // fallback / no action
  },
};

const getTriggerConfig = (action: string) => {
  return Object.values(triggerConfig).find(cfg =>
    cfg.actions.includes(action)
  );
};

export default function ScalingTab() {
  const [timeRange, setTimeRange] = useState("5m")
  const [customTime, setCustomTime] = useState("")
  const [isCustom, setIsCustom] = useState(false)
  const { clusterId } = useParams()

  if (!clusterId) {
    return <Navigate to={"/clusters"} />
  }

  const isValidTime = (value: string) =>
    /^(\d+)(m|h|d)$/.test(value)

  // Cluster scaling events
  const {
    status: eventsStatus,
    data: eventsData,
    error: eventsError,
  } = useQuery({
    queryKey: ['clusterScalingEvents', clusterId, timeRange],
    queryFn: () => getClusterScalingEvents(clusterId, { range: timeRange, limit: 10 }),
    refetchInterval: 5000,
  })

  // Cluster scaling stats
  const {
    status: statsStatus,
    data: statsData,
    error: statsError,
  } = useQuery({
    queryKey: ['scalingStats', clusterId, timeRange],
    queryFn: () => getScalingStats(clusterId, { range: timeRange }),
    refetchInterval: 5000,
  })

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Scaling Decisions</h2>
          <p className="text-sm text-muted-foreground">Timeline of scaling events and their reasons</p>
        </div>
      </div>

      {
        statsStatus === "pending"
          ? (<ScalingStatsSkeleton />)
          : (statsStatus === "error")
            ? (<ErrorPage title="Failed to fetch scaling stats" description={statsError?.message} />)
            : (<div className="mb-6 grid gap-4 sm:grid-cols-4">
              <Card className="border-border bg-card">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Total Events ({timeRange})</p>
                  <p className="text-2xl font-semibold text-foreground">{statsData?.success_count! + statsData?.failed_count!}</p>
                </CardContent>
              </Card>
              <Card className="border-border bg-card">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Scale Up Events</p>
                  <p className="text-2xl font-semibold text-chart-1">{statsData?.scale_up_count || 0}</p>
                </CardContent>
              </Card>
              <Card className="border-border bg-card">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Scale Down Events</p>
                  <p className="text-2xl font-semibold text-warning">{statsData?.scale_down_count || 0}</p>
                </CardContent>
              </Card>
              <Card className="border-border bg-card">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Failed Events</p>
                  <p className="text-2xl font-semibold text-critical">{statsData?.failed_count || 0}</p>
                </CardContent>
              </Card>
            </div>)
      }

      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-base font-medium text-foreground">Event Timeline</CardTitle>
            <div className="flex items-center gap-2">
              <Select
                value={isCustom ? "custom" : timeRange}
                onValueChange={(value) => {
                  if (value === "custom") {
                    setIsCustom(true)
                    setTimeRange("")
                  } else {
                    setIsCustom(false)
                    setTimeRange(value)
                  }
                }}
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5m">Last 5 min</SelectItem>
                  <SelectItem value="15m">Last 15 min</SelectItem>
                  <SelectItem value="1h">Last 1 hour</SelectItem>
                  <SelectItem value="custom">Custom…</SelectItem>
                </SelectContent>
              </Select>

              {isCustom && (
                <div className="flex flex-col">
                  <input
                    className="h-9 w-28 rounded-md border bg-background px-2 text-sm outline-none focus:ring-1 focus:ring-ring"
                    placeholder="e.g. 10m"
                    value={customTime}
                    onChange={(e) => {
                      const value = e.target.value
                      setCustomTime(value)

                      if (isValidTime(value)) {
                        setTimeRange(value)
                      }
                    }}
                  />
                  {!isValidTime(customTime) && customTime.length > 0 && (
                    <span className="text-xs text-destructive mt-1">
                      Use format: 5m, 1h, 2d
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {
            eventsStatus === "pending"
              ? (<ScalingEventsSkeleton />)
              : (eventsStatus === "error")
                ? <ErrorPage title="Failed to fetch scaling events" description={eventsError?.message} />
                : <div className="space-y-1">
                  {
                    eventsData?.count > 0 ? (<>
                      {eventsData.data.map((event, index) => {
                        const config = typeConfig[event.action]
                        const trigger = getTriggerConfig(event.action)
                        const Icon = config.icon
                        const TriggerIcon = trigger?.icon || Server


                        return (
                          <div
                            key={event.id}
                            className={cn(
                              "relative rounded-lg border p-4 transition-colors hover:bg-secondary/30",
                              config.border,
                              index === 0 && config.bg
                            )}
                          >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div className="flex items-center gap-3">
                                <div className={cn("rounded-md p-2", config.bg)}>
                                  <Icon className={cn("h-4 w-4", config.color)} />
                                </div>
                                <div className="space-y-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className={cn("text-sm font-medium", config.color)}>{config.label}</span>
                                    <Badge variant="outline" className={config.badge}>
                                      <TriggerIcon className="mr-1 h-3 w-3" />
                                      {trigger?.label}
                                    </Badge>
                                    {event.action === "EMERGENCY" && (
                                      <Badge variant="outline" className="border-critical/30 bg-critical/10 text-critical">High Priority</Badge>
                                    )}
                                  </div>
                                  <p className="text-sm font-medium text-foreground">{formatTitleFromSnakeCase(event.trigger_reason)}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-sm sm:flex-col sm:items-end sm:gap-1">
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                  <Server className="h-3 w-3" />
                                  <span>{event.servers_before} {"→"} {event.servers_after}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">{formatDateTime(event.timestamp)}</span>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </>)
                      : (<Card className="border-border bg-card">
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                          <Server className="h-12 w-12 text-muted-foreground mb-4" />
                          <h3 className="font-medium text-foreground mb-1">Scaling Events not detected yet</h3>
                          <p className="text-sm text-muted-foreground">
                            The cluster is within the set parameters
                          </p>
                        </CardContent>
                      </Card>
                      )
                  }
                </div>
          }
        </CardContent>
      </Card>
    </div >
  )
}