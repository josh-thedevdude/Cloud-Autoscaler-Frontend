// types/websocket.types.ts
export type SubscriptionUpdate = {
  action: "subscribed";
  cluster_id: string;
  timestamp: string;
  type: "subscription_update";
}

export type MetricsData = {
  cluster_id: string;
  timestamp: string;
  avg_cpu: number;
  avg_memory: number;
  server_count: number;
  cpu_status: "normal" | "warning" | "critical";
  memory_status: "normal" | "warning" | "critical";
  trend: "rising" | "falling" | "stable";
  has_spike: boolean;
  spike_percent: number;
  recommendation: string;
}

export type MetricsMessage = {
  type: "metrics";
  cluster_id: string;
  timestamp: string;
  severity: "info" | "warning" | "error";
  message: string;
  data: MetricsData;
}

export type DecisionData = {
  cluster_id: string;
  timestamp: string;
  action: "SCALE_UP" | "SCALE_DOWN" | "MAINTAIN";
  current_servers: number;
  target_servers: number;
  reason: string;
  prediction_used: boolean;
  is_emergency: boolean;
  cooldown_active: boolean;
}

export type DecisionMessage = {
  type: "decision";
  cluster_id: string;
  timestamp: string;
  severity: "info" | "warning" | "error";
  message: string;
  data: DecisionData;
}

export type WebSocketMessage = SubscriptionUpdate | MetricsMessage | DecisionMessage;

export type UseWebSocketOptions = {
  clusterId: string;
  url?: string;
  reconnect?: boolean;
  reconnectAttempts?: number;
  reconnectInterval?: number;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  enabled?: boolean; // Control whether to connect
}

export type UseWebSocketReturn = {
  latestMetrics: MetricsData | null;
  latestDecision: DecisionData | null;
  isConnected: boolean;
  isSubscribed: boolean;
  error: string | null;
  reconnectCount: number;
  sendMessage: (message: any) => void;
}