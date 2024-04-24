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
import {
  orderCreatePermissions,
  orderNumberCancelPermissions,
  orderNumberPaymentViewPermissions,
  orderNumberViewPermissions,
  orderViewPermissions,
} from '@/permissions';

export default async function orderRoutes(server: FastifyInstance) {
  const orderController = container.resolve(OrderController);

  server.get('/orders', {
    schema: ordersSchema,
    handler: orderController.list,
    preHandler: [
      (request, reply) =>
        server.authenticateKeyApi(request, reply, orderViewPermissions),
      (request, reply) => server.authenticateJwt(request, reply),
    ],
  });

  server.post('/orders', {
    schema: createOrderSchema,
    handler: orderController.create,
    preHandler: [
      (request, reply) =>
        server.authenticateKeyApi(request, reply, orderCreatePermissions),
      (request, reply) => server.authenticateJwt(request, reply),
    ],
  });

  server.get('/orders/:orderNumber', {
    schema: ordersByNumberParamSchema,
    handler: orderController.findByNumber,
    preHandler: [
      (request, reply) =>
        server.authenticateKeyApi(request, reply, orderNumberViewPermissions),
      (request, reply) => server.authenticateJwt(request, reply),
    ],
  });

  server.get('/orders/:orderNumber/payments', {
    schema: getPaymentsSchema,
    handler: orderController.listPayments,
    preHandler: [
      (request, reply) =>
        server.authenticateKeyApi(
          request,
          reply,
          orderNumberPaymentViewPermissions
        ),
      (request, reply) => server.authenticateJwt(request, reply),
    ],
  });

  server.post('/orders/:orderNumber/cancel', {
    schema: postCancelOrderSchema,
    handler: orderController.cancelOrder,
    preHandler: [
      (request, reply) =>
        server.authenticateKeyApi(request, reply, orderNumberCancelPermissions),
      (request, reply) => server.authenticateJwt(request, reply),
    ],
  });
}
