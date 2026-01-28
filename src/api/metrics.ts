import type { AggregatedMetric, LatestMetric, LatestMetrics, MetricsHistoryResponse, MetricsParams, ScalingEvent, ScalingParams, ScalingStats, TimeRange } from "@/types/common"
import client from "./client"
import { aggregateMetricsByTime, getTimeRangeParams } from "@/lib/chartHelpers"

// TODO Type
export const getMetrics = async (clusterId: string, params: MetricsParams) => {
  try {
    const response = await client.get(`/clusters/${clusterId}/metrics`, {
      params
    })
    return response.data
  } catch (error: any) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error(error.message)
  }
}

export const getLatestMetrics = async (clusterId: string): Promise<LatestMetrics> => {
  try {
    const response = await client.get(`/clusters/${clusterId}/metrics/latest`)
    return response.data
  } catch (error: any) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error(error.message)
  }
}

// TODO TYPE
export const getHourlyMetrics = async (clusterId: string, params: Omit<ScalingParams, "limit">) => {
  try {
    const apiRes = await client.get(`/clusters/${clusterId}/metrics/hourly`, {
      params
    })
    return apiRes.data
  } catch (error: any) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error(error.message)
  }
}

export const getClusterScalingEvents = async (clusterId: string, params: ScalingParams): Promise<ScalingEvent> => {
  try {
    const reponse = await client.get(`/clusters/${clusterId}/events`, {
      params
    })
    return reponse.data
  } catch (error: any) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error(error.message)
  }
}

// Type TODO
export const getScalingEvents = async (params: Omit<ScalingParams, "range">) => {
  try {
    const response = await client.get("/events/recent", {
      params
    })
    return response.data
  } catch (error: any) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error(error.message)
  }
}

export const getScalingStats = async (clusterId: string, params: Omit<ScalingParams, "limit">): Promise<ScalingStats> => {
  try {
    const response = await client.get(`/clusters/${clusterId}/events/stats`, {
      params
    })
    return response.data
  } catch (error: any) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error(error.message)
  }
}

// Fetch historical metrics
export const fetchClusterMetrics = async (
  clusterId: string,
  timeRange: TimeRange
): Promise<AggregatedMetric[]> => {
  const { from, limit } = getTimeRangeParams(timeRange);

  try {
    const apiRes = await client.get(`/clusters/${clusterId}/metrics`, {
      params: {
        from,
        limit
      }
    })
    const data: MetricsHistoryResponse = apiRes.data;
    if (!data.data || data.data.length === 0) {
      return [];
    }
    return aggregateMetricsByTime(data.data);
  } catch (error: any) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error(error.message)
  }
};

// Fetch latest metric
export const fetchLatestMetric = async (
  clusterId: string
): Promise<AggregatedMetric> => {
  try {
    const apiRes = await client.get(`/clusters/${clusterId}/metrics/latest`);
    const data: LatestMetric = apiRes.data;
    return {
      time: data.time,
      avg_cpu: data.avg_cpu,
      avg_memory: data.avg_memory,
      server_count: data.sample_count,
      max_cpu: data.max_cpu,
      min_cpu: data.min_cpu,
    };
  } catch (error: any) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error(error.message)
  }
};