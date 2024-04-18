import OrderController from '@/controllers/order';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import { ordersFromPartnersSchema } from '@core/validations/order';

export default async function orderRoutes(server: FastifyInstance) {
  const orderController = container.resolve(OrderController);

  server.get('/orders', {
    schema: ordersFromPartnersSchema,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
    handler: orderController.list,
  });
}
