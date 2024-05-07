import { FastifyInstance } from 'fastify';
import { WebsocketController } from '@/controller';
import { container } from 'tsyringe';

export default async function paymentRoute(server: FastifyInstance) {
  const service = container.resolve(WebsocketController);

  server.post('/payment/:id', {
    handler: service.payment,
  });
}
