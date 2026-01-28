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