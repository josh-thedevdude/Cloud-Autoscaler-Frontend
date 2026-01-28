// hooks/useClusterMetrics.ts
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { fetchClusterMetrics, fetchLatestMetric } from '@/api/metrics';
import { getPollingInterval } from '@/lib/chartHelpers';
import type { TimeRange } from '@/types/common';

// Hook for historical metrics
export const useMetricsHistory = (clusterId: string, timeRange: TimeRange) => {
  return useQuery({
    queryKey: ['metrics', 'history', clusterId, timeRange],
    queryFn: () => fetchClusterMetrics(clusterId, timeRange),
    staleTime: getPollingInterval(timeRange) / 2,
    gcTime: getPollingInterval(timeRange) * 2,
    refetchInterval: getPollingInterval(timeRange),
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Hook for latest metrics (real-time polling)
export const useLatestMetrics = (
  clusterId: string,
  timeRange: TimeRange,
  enabled: boolean = true
) => {
  const interval = getPollingInterval(timeRange);

  return useQuery({
    queryKey: ['metrics', 'latest', clusterId],
    queryFn: () => fetchLatestMetric(clusterId),
    staleTime: interval / 2,
    gcTime: interval * 2,
    refetchInterval: interval,
    refetchOnWindowFocus: true,
    enabled,
    retry: 3,
  });
};

// Combined hook for both historical and live metrics
export const useLiveMetrics = (clusterId: string, timeRange: TimeRange) => {
  // Fetch historical data
  const {
    data: historyData = [],
    isLoading: isLoadingHistory,
    error: historyError,
    refetch: refetchHistory,
  } = useMetricsHistory(clusterId, timeRange);

  // Fetch latest metric
  const {
    data: latestMetric,
    isLoading: isLoadingLatest,
    error: latestError,
  } = useLatestMetrics(clusterId, timeRange);

  // Merge historical and latest data
  const metricsData = useMemo(() => {
    if (!latestMetric) return historyData;

    // Check if latest metric already exists in history
    const existingIndex = historyData.findIndex(
      (m) => m.time === latestMetric.time
    );

    if (existingIndex !== -1) {
      // Update existing entry
      const updated = [...historyData];
      updated[existingIndex] = latestMetric;
      return updated;
    }

    // Append new entry and limit to max points
    const updated = [...historyData, latestMetric];
    const maxPoints = 500;
    return updated.slice(-maxPoints);
  }, [historyData, latestMetric]);

  return {
    data: metricsData,
    latestMetric,
    isLoading: isLoadingHistory || isLoadingLatest,
    isConnected: !historyError && !latestError,
    error: historyError || latestError,
    refetch: refetchHistory,
  };
};