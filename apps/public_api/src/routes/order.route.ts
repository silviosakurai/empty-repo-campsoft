import OrderController from '@/controllers/order';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import {
  ordersSchema,
  getPayments,
  ordersByNumberParamSchema,
} from '@core/validations/order/order.validation';

export default async function orderRoutes(server: FastifyInstance) {
  const orderController = container.resolve(OrderController);

  server.get('/orders', {
    schema: ordersSchema,
    handler: orderController.list,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
  });

  server.get('/orders/:orderNumber', {
    schema: ordersByNumberParamSchema,
    handler: orderController.findByNumber,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
  });

  server.get('/orders/:orderNumber/payments', {
    schema: getPayments,
    handler: orderController.listPayments,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
  });
}
