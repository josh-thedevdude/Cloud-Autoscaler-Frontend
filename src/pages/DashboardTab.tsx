import { Activity, Cpu, HardDrive, Server } from "lucide-react";
import { useParams } from "react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react";
import { formatDateTime, formatTitleFromSnakeCase } from "@/lib/formatter";
import { useWebSocket } from "@/hooks/useWebSocket";
import { StatusCardsSkeleton } from "@/skeletons/StatusCardsSkeleton";
import StatusCard from "@/components/StatusCard";

export default function DashboardTab() {
  const params = useParams()
  const clusterId = params.clusterId as string

  const {
    latestMetrics,
    latestDecision,
  } = useWebSocket({
    clusterId,
    reconnect: true,
    reconnectAttempts: 5,
    reconnectInterval: 3000,
    onOpen: () => console.log('Connected to cluster:', clusterId),
    onClose: () => console.log('Disconnected from cluster:', clusterId),
    onError: (err) => console.error('WebSocket error:', err),
  });

  const [timeRange, setTimeRange] = useState("15")

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">Overview</h2>
        <p className="text-sm text-muted-foreground">
          Real-time cluster health and autoscaling status
        </p>
      </div>

      <div className="space-y-6">
        {
          latestMetrics ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <StatusCard
                title="System Status"
                value={"Active"}
                subtitle={formatDateTime(latestMetrics?.timestamp)}
                icon={Activity}
                status="active"
              />
              <StatusCard
                title="Active Servers"
                value={String(latestMetrics?.server_count)}
                // TODO Dynamic
                subtitle={"Min: 2 / Max: 12"}
                icon={Server}
                status="active"
              />
              <StatusCard
                title="CPU Usage"
                value={String(latestMetrics?.avg_cpu.toFixed(2)) + " %"}
                subtitle={formatTitleFromSnakeCase(latestMetrics?.cpu_status || "")}
                icon={Cpu}
                status="paused"
              />
              <StatusCard
                title="Memory Usage"
                value={String(latestMetrics?.avg_memory.toFixed(2)) + " %"}
                subtitle={formatTitleFromSnakeCase(latestMetrics?.memory_status || "")}
                icon={HardDrive}
                status="active"
              />
              <StatusCard
                title="Emergency State"
                value={formatTitleFromSnakeCase(latestDecision?.action || "")}
                subtitle={formatTitleFromSnakeCase(latestDecision?.reason || "")}
                icon={HardDrive}
                status="active"
              />
            </div>
          ) : <StatusCardsSkeleton />
        }

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Metrics & Monitoring</h2>
            <p className="text-sm text-muted-foreground">
              Deep inspection of cluster performance
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">Last 5 min</SelectItem>
                <SelectItem value="15">Last 15 min</SelectItem>
                <SelectItem value="60">Last 1 hour</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}