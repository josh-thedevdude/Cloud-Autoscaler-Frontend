export type ClusterResponse =
  {
    id: string,
    name: string,
    min_servers: number,
    max_servers: number,
    status: "active" | "paused",
    config: {
      collector_endpoint: string,
      target_cpu: number
    },
    created_at: string,
    updated_at: string
  }

export type CreateCluster = {
  name: string,
  minNodes: number,
  maxNodes: number,
  metricsEndpoint: string,
  targetCpu: number
}

export type DeleteClusterResponse = { message: string }

export type StatusReponse = {
  cluster_id: string,
  name: string,
  servers: {
    active: number,
    draining: number,
    provisioning: number,
    total: number
  },
  status: "active" | "paused"
}

// CLUSTER DIALOG
export type Cluster = {
  id: string,
  name: string,
  minNodes: number,
  maxNodes: number,
  status: "active" | "paused",
  metricsEndpoint: string,
  targetCpu: number
}

export type ClusterDialogProps = {
  cluster?: Cluster; // 👈 if present = edit mode
  trigger?: React.ReactNode;
}

// METRICS
export type MetricsParams = {
  aggregated: boolean,
  range: string,
  bucket: number
}

export type ScalingParams = {
  range: string,
  limit: number
}

export type LatestMetrics = {
  time: string,
  cluster_id: string,
  avg_cpu: number,
  avg_memory: number,
  avg_load: number,
  max_cpu: number,
  min_cpu: number,
  sample_count: number
}

export type ScalingEvent = {
  cluster_id: string,
  count: number,
  data: {
    id: number,
    cluster_id: string,
    timestamp: string,
    action: "SCALE_UP" | "SCALE_DOWN" | "EMERGENCY",
    servers_before: number,
    servers_after: number,
    trigger_reason: string,
    prediction_used: boolean,
    status: "success" | "failed"
  }[],
  from: string,
  to: string
}

export type ScalingStats = {
  cluster_id: string,
  from: string,
  to: string,
  scale_up_count: number,
  scale_down_count: number,
  success_count: number,
  failed_count: number,
  prediction_count: number
}