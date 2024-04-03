import OrderController from '@/controllers/order';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import {
  ordersSchema,
  getPaymentsSchema,
  postCancelOrderSchema,
  ordersByNumberParamSchema,
} from '@core/validations/order';

export default async function orderRoutes(server: FastifyInstance) {
  const orderController = container.resolve(OrderController);

  server.get('/orders', {
    schema: ordersSchema,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
    handler: orderController.list,
  });

  server.get('/orders/:orderNumber', {
    schema: ordersByNumberParamSchema,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
    handler: orderController.findByNumber,
  });

  server.get('/orders/:orderNumber/payments', {
    schema: getPaymentsSchema,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
    handler: orderController.listPayments,
  });

  server.post('/orders/:orderNumber/cancel', {
    schema: postCancelOrderSchema,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
    handler: orderController.cancelOrder,
  });
}
