import OrderController from '@/controllers/order';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import {
  ordersByNumberParamSchema,
  ordersSchema,
} from '@core/validations/order';

export default async function orderRoutes(server: FastifyInstance) {
  const orderController = container.resolve(OrderController);

  server.get('/orders', {
    schema: ordersSchema,
    handler: orderController.list,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
  });

  server.get('/orders/:orderNumber', {
    schema: ordersByNumberParamSchema,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
    handler: orderController.findByNumber,
  });
}
