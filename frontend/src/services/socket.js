import { io } from 'socket.io-client';

let socket = null;

export function createSocket(user) {
  if (socket) return socket;
  const url = process.env.REACT_APP_API_URL || 'http://localhost:4000';
  socket = io(url, {
    auth: { token: user?.token },
    reconnectionAttempts: 5,
    transports: ['websocket']
  });

  socket.on('connect_error', (err) => console.warn('Socket connect error', err));
  return socket;
}

export function getSocket() { return socket; }
