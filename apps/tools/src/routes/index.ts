import { FastifyInstance } from 'fastify';
import webhooksRoutes from '@/routes/webhook.route';
import websocketRoutes from '@/routes/websocket.route';

export default async function (server: FastifyInstance) {
  await server.register(webhooksRoutes);
  await server.register(websocketRoutes);
}
