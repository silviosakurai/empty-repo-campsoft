import OrderController from '@/controllers/order';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';

export default async function orderRoutes(server: FastifyInstance) {
  const orderController = container.resolve(OrderController);

  server.get('/orders/:order_number', {
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
    handler: orderController.readByNumber,
  });
}
