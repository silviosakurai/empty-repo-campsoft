import OrderController from '@/controllers/order';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';


export default async function orderRoutes(server: FastifyInstance) {
  const orderController = container.resolve(OrderController);

  server.get('/orders', {
    handler: orderController.list,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
  });
}
