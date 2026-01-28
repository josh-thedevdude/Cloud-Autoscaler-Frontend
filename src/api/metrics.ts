import type { LatestMetrics, MetricsParams, ScalingEvent, ScalingParams, ScalingStats } from "@/types/common"
import client from "./client"

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