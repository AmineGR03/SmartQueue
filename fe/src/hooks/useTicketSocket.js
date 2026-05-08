import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';

const WS_BASE = process.env.REACT_APP_WS_URL || 'ws://localhost:8080';
const TOPIC = '/topic/tickets';

/**
 * Se connecte au broker STOMP et appelle onEvent à chaque message sur les tickets.
 */
export function useTicketSocket(onEvent, enabled = true) {
  const clientRef = useRef(null);
  const cbRef = useRef(onEvent);
  cbRef.current = onEvent;

  useEffect(() => {
    if (!enabled) return undefined;

    const client = new Client({
      brokerURL: `${WS_BASE}/ws-queue`,
      reconnectDelay: 4000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        client.subscribe(TOPIC, (message) => {
          try {
            const body = JSON.parse(message.body);
            cbRef.current?.(body);
          } catch {
            cbRef.current?.(message.body);
          }
        });
      },
      onStompError: (frame) => {
        console.warn('STOMP error', frame.headers?.message);
      },
      onWebSocketError: (e) => {
        console.warn('WebSocket error', e);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
      clientRef.current = null;
    };
  }, [enabled]);
}
