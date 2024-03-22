import OrderController from '@/controllers/order';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';

export default async function orderRoutes(server: FastifyInstance) {
  const orderController = container.resolve(OrderController);

  server.get('/orders/:orderNumber', {
    handler: orderController.readByNumber,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
  });
}
