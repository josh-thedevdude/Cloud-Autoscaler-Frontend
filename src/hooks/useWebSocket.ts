import type { DecisionData, MetricsData, UseWebSocketOptions, UseWebSocketReturn, WebSocketMessage } from "@/types/websocket";
import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws';
const DEFAULT_RECONNECT_ATTEMPTS = 5;
const DEFAULT_RECONNECT_INTERVAL = 3000; // 3 seconds

export const useWebSocket = ({
  clusterId,
  url = DEFAULT_WS_URL,
  reconnect = true,
  reconnectAttempts = DEFAULT_RECONNECT_ATTEMPTS,
  reconnectInterval = DEFAULT_RECONNECT_INTERVAL,
  onOpen,
  onClose,
  onError,
  enabled = true,
}: UseWebSocketOptions): UseWebSocketReturn => {
  const [latestMetrics, setLatestMetrics] = useState<MetricsData | null>(null);
  const [latestDecision, setLatestDecision] = useState<DecisionData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reconnectCount, setReconnectCount] = useState(0);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const shouldReconnectRef = useRef(true);

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected. Cannot send message.');
    }
  }, []);

  const subscribe = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      sendMessage({
        type: 'subscribe',
        cluster_id: clusterId,
      });
    }
  }, [clusterId, sendMessage]);

  const unsubscribe = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      sendMessage({
        type: 'unsubscribe',
        cluster_id: clusterId,
      });
      setIsSubscribed(false);
    }
  }, [clusterId, sendMessage]);

  // Parse multiple JSON objects (handles both concatenated and newline-separated)
  const parseMultipleJSON = useCallback((data: string): WebSocketMessage[] => {
    const messages: WebSocketMessage[] = [];

    // First, try splitting by newlines
    const lines = data.trim().split('\n').filter(line => line.trim());

    if (lines.length > 1) {
      // Multiple lines detected, parse each
      for (const line of lines) {
        try {
          const parsed = JSON.parse(line.trim());
          messages.push(parsed);
        } catch (err) {
          console.error('Error parsing JSON line:', err);
        }
      }
    } else {
      // Single line or concatenated JSON, use brace counting
      let remaining = data.trim();

      while (remaining.length > 0) {
        try {
          let braceCount = 0;
          let inString = false;
          let escapeNext = false;
          let endIndex = -1;

          for (let i = 0; i < remaining.length; i++) {
            const char = remaining[i];

            if (escapeNext) {
              escapeNext = false;
              continue;
            }

            if (char === '\\') {
              escapeNext = true;
              continue;
            }

            if (char === '"') {
              inString = !inString;
              continue;
            }

            if (!inString) {
              if (char === '{') {
                braceCount++;
              } else if (char === '}') {
                braceCount--;
                if (braceCount === 0) {
                  endIndex = i + 1;
                  break;
                }
              }
            }
          }

          if (endIndex === -1) break;

          const jsonStr = remaining.substring(0, endIndex);
          const parsed = JSON.parse(jsonStr);
          messages.push(parsed);

          remaining = remaining.substring(endIndex).trim();
        } catch (err) {
          console.error('Error parsing concatenated JSON:', err);
          break;
        }
      }
    }

    return messages;
  }, []);

  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const messages = parseMultipleJSON(event.data);

      messages.forEach((message: WebSocketMessage) => {
        switch (message.type) {
          case 'subscription_update':
            if (message.action === 'subscribed') {
              setIsSubscribed(true);
              setError(null);
              console.log(`✅ Subscribed to cluster: ${message.cluster_id}`);
            }
            break;

          case 'metrics':
            if (message.cluster_id === clusterId) {
              setLatestMetrics(message.data);
              console.log('📊 Metrics updated:', message.data);
            }
            break;

          case 'decision':
            if (message.cluster_id === clusterId) {
              setLatestDecision(message.data);
              console.log('🎯 Decision updated:', message.data);
            }
            break;

          default:
            console.warn('Unknown message type:', message);
        }
      });
    } catch (err) {
      console.error('Error handling WebSocket message:', err);
      console.error('Raw message data:', event.data);
      setError('Failed to parse message');
    }
  }, [clusterId, parseMultipleJSON]);

  const connect = useCallback(() => {
    // Don't connect if disabled or already connected
    if (!enabled || wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      console.log(`🔌 Connecting to WebSocket: ${url}`);
      const ws = new WebSocket(url);

      ws.onopen = () => {
        console.log('✅ WebSocket connected');
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;
        setReconnectCount(0);

        // Subscribe to cluster on connection
        subscribe();

        onOpen?.();
      };

      ws.onmessage = handleMessage;

      ws.onerror = (event) => {
        console.error('❌ WebSocket error:', event);
        setError('WebSocket connection error');
        onError?.(event);
      };

      ws.onclose = (event) => {
        console.log('🔌 WebSocket closed:', event.code, event.reason);
        setIsConnected(false);
        setIsSubscribed(false);

        onClose?.();

        // Attempt reconnection if enabled and within attempts limit
        if (
          shouldReconnectRef.current &&
          reconnect &&
          reconnectAttemptsRef.current < reconnectAttempts
        ) {
          reconnectAttemptsRef.current += 1;
          setReconnectCount(reconnectAttemptsRef.current);

          console.log(
            `🔄 Reconnecting... (Attempt ${reconnectAttemptsRef.current}/${reconnectAttempts})`
          );

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        } else if (reconnectAttemptsRef.current >= reconnectAttempts) {
          setError(`Failed to reconnect after ${reconnectAttempts} attempts`);
        }
      };

      wsRef.current = ws;
    } catch (err) {
      console.error('Error creating WebSocket:', err);
      setError('Failed to create WebSocket connection');
    }
  }, [
    enabled,
    url,
    reconnect,
    reconnectAttempts,
    reconnectInterval,
    subscribe,
    handleMessage,
    onOpen,
    onClose,
    onError,
  ]);

  // Initialize connection
  useEffect(() => {
    if (enabled) {
      connect();
    }

    // Cleanup on unmount or when clusterId changes
    return () => {
      shouldReconnectRef.current = false;

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      if (wsRef.current) {
        // Unsubscribe before closing
        if (wsRef.current.readyState === WebSocket.OPEN) {
          unsubscribe();
        }

        wsRef.current.close(1000, 'Component unmounting');
        wsRef.current = null;
      }

      // Reset state
      setIsConnected(false);
      setIsSubscribed(false);
      setLatestMetrics(null);
      setLatestDecision(null);
    };
  }, [clusterId, enabled]);

  // Re-enable reconnection when component remounts
  useEffect(() => {
    shouldReconnectRef.current = true;
  }, []);

  return {
    latestMetrics,
    latestDecision,
    isConnected,
    isSubscribed,
    error,
    reconnectCount,
    sendMessage,
  };
}