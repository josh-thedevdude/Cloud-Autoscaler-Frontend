import { useState } from "react";
import TimeRangeSelector from "./TimeRangeSelector";
import { useLiveMetrics } from "../hooks/useClusterMetrics";
import type { TimeRange } from "@/types/common";
import MetricsAreaChart from "./MetricsAreaChart";

interface ClusterMetricsDashboardProps {
  clusterId: string;
}

export const ClusterMetricsDashboard = ({
  clusterId,
}: ClusterMetricsDashboardProps) => {
  const [timeRange, setTimeRange] = useState<TimeRange>("1h");

  const { data, latestMetric, isLoading, isConnected, error, refetch } =
    useLiveMetrics(clusterId, timeRange);

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
        <p className="text-destructive text-sm">
          Error: {(error as Error).message}
        </p>
        <button
          onClick={() => refetch()}
          className="mt-3 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors text-sm font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-foreground">
            Cluster Metrics
          </h2>
          {isConnected && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-success/10 border border-success/20 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
              </span>
              <span className="text-xs text-success font-medium">
                LIVE
              </span>
            </div>
          )}
        </div>

        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      </div>

      {/* Charts */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-muted border-t-primary"></div>
            <p className="text-sm text-muted-foreground">Loading metrics...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CPU Chart */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              CPU Usage
            </h3>
            <MetricsAreaChart
              data={data}
              dataKey="avg_cpu"
              name="CPU"
              threshold={80}
              height={300}
              color="oklch(0.65 0.18 250)"
              timeRange={timeRange}
            />
          </div>

          {/* Memory Chart */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Memory Usage
            </h3>
            <MetricsAreaChart
              data={data}
              dataKey="avg_memory"
              name="Memory"
              threshold={70}
              height={300}
              color="oklch(0.65 0.18 140)"
              timeRange={timeRange}
            />
          </div>
        </div>
      )}

      {/* Footer info */}
      <div className="text-xs text-muted-foreground text-center">
        Showing {data.length} data points | Last updated:{" "}
        {latestMetric ? new Date(latestMetric.time).toLocaleTimeString() : "N/A"}
      </div>
    </div>
  );
};