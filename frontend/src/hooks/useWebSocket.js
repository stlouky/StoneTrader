import { useState, useEffect, useRef, useCallback } from 'react';

const WS_URL = 'ws://localhost:3001';

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  
  const connect = useCallback(() => {
    try {
      socketRef.current = new WebSocket(WS_URL);
      
      socketRef.current.onopen = () => {
        setIsConnected(true);
        reconnectAttempts.current = 0;
      };
      
      socketRef.current.onclose = () => {
        setIsConnected(false);
        if (reconnectAttempts.current < maxReconnectAttempts) {
          setTimeout(() => {
            reconnectAttempts.current++;
            connect();
          }, 1000 * Math.pow(2, reconnectAttempts.current));
        }
      };
      
    } catch (error) {
      console.error('WebSocket connection failed:', error);
    }
  }, []);
  
  const sendMessage = useCallback((message) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
      return true;
    }
    return false;
  }, []);
  
  useEffect(() => {
    connect();
    return () => socketRef.current?.close();
  }, [connect]);
  
  return { isConnected, sendMessage };
}
