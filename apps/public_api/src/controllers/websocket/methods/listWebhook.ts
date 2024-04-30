import { FastifyRequest } from 'fastify';
import { WebSocket } from 'ws';

export const listWebhook = async (
  socket: WebSocket,
  request: FastifyRequest
) => {
  console.log('Client connected');

  socket.on('message', (message) => {
    socket.send('hi from server ' + message);
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });
};
