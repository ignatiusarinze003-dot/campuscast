// useSocket.js — manages the Socket.io connection
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SERVER_URL = 'http://localhost:4000';

export function useSocket() {
  const socketRef = useRef(null);

  useEffect(() => {
    // Create the socket connection
    socketRef.current = io(SERVER_URL, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('Connected to CampusCast server:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from CampusCast server');
    });

    socket.on('connect_error', (err) => {
      console.log('Connection error:', err.message);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return socketRef;
}