import OrderController from '@/controllers/order';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import { ordersSchema } from '@core/validations/order';
import { ordersByNumberParamSchema } from '@core/validations/order/order.validation';

export default async function orderRoutes(server: FastifyInstance) {
  const orderController = container.resolve(OrderController);

  server.get('/orders', {
    schema: ordersSchema,
    handler: orderController.list,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
  });

  server.get('/orders/:orderNumber', {
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
    handler: orderController.findByNumber,
    schema: ordersByNumberParamSchema,
  });
}
