import { Activity, Cpu, HardDrive, Server } from "lucide-react";
import { useParams } from "react-router";
import { formatDateTime, formatPercent, formatTitleFromSnakeCase } from "@/lib/formatter";
import { useWebSocket } from "@/hooks/useWebSocket";
import { StatusCardsSkeleton } from "@/skeletons/StatusCardsSkeleton";
import StatusCard from "@/components/StatusCard";
import { ClusterMetricsDashboard } from "@/components/ClusterMetricDashboard";

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

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Overview</h2>
        <p className="text-sm text-muted-foreground">
          Real-time cluster health and autoscaling status
        </p>
      </div>

      <div className="space-y-10">
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
                value={formatPercent(latestMetrics?.avg_cpu)}
                subtitle={formatTitleFromSnakeCase(latestMetrics?.cpu_status || "")}
                icon={Cpu}
                status="paused"
              />
              <StatusCard
                title="Memory Usage"
                value={formatPercent(latestMetrics?.avg_memory)}
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

        <ClusterMetricsDashboard clusterId={clusterId} />
      </div>
    </div>
  )
}