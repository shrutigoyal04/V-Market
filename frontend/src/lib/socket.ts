// frontend/src/lib/socket.ts
import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    const backendWsUrl = process.env.NEXT_PUBLIC_BACKEND_WS_URL; // <--- CORRECTED: Use NEXT_PUBLIC_BACKEND_WS_URL
    const namespace = 'notifications'; // Define the namespace

    socket = io(`${backendWsUrl}/${namespace}`, { // <--- CORRECTED: Include namespace
      autoConnect: false,
      transports: ['websocket'],
      auth: (cb) => { // Use a callback for dynamic token retrieval
        const token = Cookies.get('token');
        cb({ token });
      },
    });

    socket.on('connect', () => {
      console.log('WebSocket connected:', socket?.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
    });

    socket.on('connect_error', (err) => { // Changed error to err for consistency
      console.error('WebSocket connection error:', err.message);
    });

    socket.on('exception', (error) => {
      console.error('WebSocket backend exception:', error);
    });

    socket.on('connectionError', (data) => {
      console.error('WebSocket authentication error:', data.message, data.details);
      socket?.disconnect();
    });
  }
  return socket;
};