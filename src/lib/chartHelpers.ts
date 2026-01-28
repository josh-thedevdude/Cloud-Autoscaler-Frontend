import type { AggregatedMetric, ServerMetric, TimeRange, TimeRangeOption } from "@/types/common";

// Calculate time range parameters
export const getTimeRangeParams = (timeRange: TimeRange) => {
  const now = new Date();
  const minutes = {
    '30s': 0.5,
    '1m': 1,
    '5m': 5,
    '15m': 15,
    '30m': 30,
    '1h': 60,
    '3h': 180,
    '6h': 360,
    '12h': 720,
    '24h': 1440,
    '7d': 10080,
    '30d': 43200,
  }[timeRange];

  const from = new Date(now.getTime() - minutes * 60 * 1000).toISOString();
  const limit = Math.min(Math.ceil(minutes / 5), 500);

  return { from, limit };
};

// Aggregate server metrics by timestamp
export const aggregateMetricsByTime = (metrics: ServerMetric[]): AggregatedMetric[] => {
  // Group by timestamp
  const grouped = metrics.reduce((acc, metric) => {
    const timeKey = metric.time;
    if (!acc[timeKey]) {
      acc[timeKey] = [];
    }
    acc[timeKey].push(metric);
    return acc;
  }, {} as Record<string, ServerMetric[]>);

  // Calculate aggregates for each timestamp
  const aggregated = Object.entries(grouped).map(([time, metricsAtTime]) => {
    const cpuValues = metricsAtTime.map(m => m.cpu_usage);
    const memoryValues = metricsAtTime.map(m => m.memory_usage);

    return {
      time,
      avg_cpu: cpuValues.reduce((a, b) => a + b, 0) / cpuValues.length,
      avg_memory: memoryValues.reduce((a, b) => a + b, 0) / memoryValues.length,
      server_count: metricsAtTime.length,
      max_cpu: Math.max(...cpuValues),
      min_cpu: Math.min(...cpuValues),
      max_memory: Math.max(...memoryValues),
      min_memory: Math.min(...memoryValues),
    };
  });

  // Sort by timestamp
  return aggregated.sort((a, b) =>
    new Date(a.time).getTime() - new Date(b.time).getTime()
  );
};

// Get polling interval based on time range
export const getPollingInterval = (timeRange: TimeRange): number => {
  return {
    '30s': 500,
    '1m': 1000,
    '5m': 1000,
    '15m': 5000,
    '30m': 10000,
    '1h': 15000,
    '3h': 30000,
    '6h': 60000,
    '12h': 120000,
    '24h': 300000,
    '7d': 600000,
    '30d': 900000,
  }[timeRange] || 30000;
};

export const TIME_RANGE_OPTIONS: TimeRangeOption[] = [
  { value: '30s', label: 'Last 30 seconds', minutes: 0.5 },
  { value: '1m', label: 'Last 1 minutes', minutes: 1 },
  { value: '5m', label: 'Last 5 minutes', minutes: 5 },
  { value: '15m', label: 'Last 15 minutes', minutes: 15 },
  { value: '30m', label: 'Last 30 minutes', minutes: 30 },
  { value: '1h', label: 'Last 1 hour', minutes: 60 },
  { value: '3h', label: 'Last 3 hours', minutes: 180 },
  { value: '6h', label: 'Last 6 hours', minutes: 360 },
  { value: '12h', label: 'Last 12 hours', minutes: 720 },
  { value: '24h', label: 'Last 24 hours', minutes: 1440 },
  { value: '7d', label: 'Last 7 days', minutes: 10080 },
  { value: '30d', label: 'Last 30 days', minutes: 43200 },
];