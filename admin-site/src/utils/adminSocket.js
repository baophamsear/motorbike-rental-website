// src/utils/adminSocket.js

import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

export const connectAdminSocket = (onReceiveMessage) => {
  const socket = new SockJS('http://localhost:8080/ws');

  const client = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    onConnect: () => {
      console.log('✅ WebSocket connected (admin)');
      client.subscribe('/topic/admin-bike-notifications', (message) => {
        const data = JSON.parse(message.body);
        onReceiveMessage(data);
      });
    },
    onStompError: (frame) => {
      console.error('❌ STOMP error', frame);
    },
  });

  client.activate();
  return client;
};
