import { FastifyRequest } from 'fastify';
import { WebSocket } from '@fastify/websocket';

export const listWebhook = async (
  socket: WebSocket,
  request: FastifyRequest
) => {
  console.log('Client connected');

  socket.on('message', (message) => {
    socket.send('hi from server ');
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });
};
