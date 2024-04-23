import OrderController from '@/controllers/order';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import {
  ordersSchema,
  getPaymentsSchema,
  postCancelOrderSchema,
  ordersByNumberParamSchema,
  createOrderSchema,
} from '@core/validations/order';

export default async function orderRoutes(server: FastifyInstance) {
  const orderController = container.resolve(OrderController);

  server.get('/orders', {
    schema: ordersSchema,
    handler: orderController.list,
    preHandler: [
      (request, reply) => server.authenticateKeyApi(request, reply, null),
      (request, reply) => server.authenticateJwt(request, reply),
    ],
  });

  server.post('/orders', {
    schema: createOrderSchema,
    handler: orderController.create,
    preHandler: [
      (request, reply) => server.authenticateKeyApi(request, reply, null),
      (request, reply) => server.authenticateJwt(request, reply),
    ],
  });

  server.get('/orders/:orderNumber', {
    schema: ordersByNumberParamSchema,
    handler: orderController.findByNumber,
    preHandler: [
      (request, reply) => server.authenticateKeyApi(request, reply, null),
      (request, reply) => server.authenticateJwt(request, reply),
    ],
  });

  server.get('/orders/:orderNumber/payments', {
    schema: getPaymentsSchema,
    handler: orderController.listPayments,
    preHandler: [
      (request, reply) => server.authenticateKeyApi(request, reply, null),
      (request, reply) => server.authenticateJwt(request, reply),
    ],
  });

  server.post('/orders/:orderNumber/cancel', {
    schema: postCancelOrderSchema,
    handler: orderController.cancelOrder,
    preHandler: [
      (request, reply) => server.authenticateKeyApi(request, reply, null),
      (request, reply) => server.authenticateJwt(request, reply),
    ],
  });
}
