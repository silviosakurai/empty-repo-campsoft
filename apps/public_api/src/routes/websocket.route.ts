import WebsocketController from '@/controllers/websocket';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';

export default async function websocketRoute(server: FastifyInstance) {
  const service = container.resolve(WebsocketController);

  server.register(async function (fastify) {
    fastify.get('/', { websocket: true }, (socket, req) => {
      service.listWebhook(socket, req);
    });
  });
}
