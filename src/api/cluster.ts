import { AxiosError } from "axios";
import client from "./client"
import type { ClusterResponse, CreateCluster, DeleteClusterResponse, StatusReponse } from "@/types/common";

export const getClusters = async (): Promise<ClusterResponse[]> => {
  try {
    const apiRes = await client.get("/clusters")
    return apiRes.data.clusters as ClusterResponse[]
  } catch (error: any) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.error ?? "Something went wrong")
    }
    throw new Error(error.message)
  }
}

export const postClusters = async (cluster: CreateCluster): Promise<ClusterResponse> => {
  try {
    const apiRes = await client.post("/clusters", {
      name: cluster.name,
      min_servers: cluster.minNodes,
      max_servers: cluster.maxNodes,
      config: {
        collector_endpoint: cluster.metricsEndpoint,
        target_cpu: cluster.targetCpu
      }
    })
    return apiRes.data as ClusterResponse
  } catch (error: any) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.error ?? "Something went wrong")
    }
    throw new Error(error.message)
  }
}

export const getClusterById = async (id: string): Promise<ClusterResponse> => {
  try {
    const apiRes = await client.get(`/clusters/${id}`)
    return apiRes.data as ClusterResponse
  } catch (error: any) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.error ?? "Something went wrong")
    }
    throw new Error(error.message)
  }
}

export const updateClusterById = async (id: string, cluster: CreateCluster): Promise<ClusterResponse> => {
  try {
    const apiRes = await client.put(`/clusters/${id}`, {
      name: cluster.name,
      min_servers: cluster.minNodes,
      max_servers: cluster.maxNodes,
      config: {
        collection_endpoint: cluster.metricsEndpoint,
        target_cpu: cluster.targetCpu
      }
    })
    return apiRes.data as ClusterResponse
  } catch (error: any) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.error ?? "Something went wrong")
    }
    throw new Error(error.message)
  }
}

export const deleteClusterById = async (id: string): Promise<DeleteClusterResponse> => {
  try {
    const apiRes = await client.delete(`/clusters/${id}`)
    return apiRes.data.message
  } catch (error: any) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.error ?? "Something went wrong")
    }
    throw new Error(error.message)
  }
}

export const getClusterStatus = async (id: string): Promise<StatusReponse> => {
  try {
    const apiRes = await client.get(`/clusters/${id}/status`)
    return apiRes.data
  } catch (error: any) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.error ?? "Something went wrong")
    }
    throw new Error(error.message)
  }
}