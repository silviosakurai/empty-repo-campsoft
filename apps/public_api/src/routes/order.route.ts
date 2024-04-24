import OrderController from '@/controllers/order';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import {
  ordersSchema,
  getPaymentsSchema,
  postCancelOrderSchema,
  ordersByNumberParamSchema,
  createOrderSchema,
  postOrderPaymentBoletoSchema,
  postOrderPaymentCardSchema,
} from '@core/validations/order';
import {
  orderCreatePermissions,
  orderNumberCancelPermissions,
  orderNumberPaymentViewPermissions,
  orderViewPermissions,
  orderPaymentBoletoPermissions,
  orderListPermissions,
} from '@/permissions';

export default async function orderRoutes(server: FastifyInstance) {
  const orderController = container.resolve(OrderController);

  server.get('/orders', {
    schema: ordersSchema,
    handler: orderController.list,
    preHandler: [
      (request, reply) =>
        server.authenticateKeyApi(request, reply, orderListPermissions),
      (request, reply) =>
        server.authenticateJwt(request, reply, orderListPermissions),
    ],
  });

  server.post('/orders', {
    schema: createOrderSchema,
    handler: orderController.create,
    preHandler: [
      (request, reply) =>
        server.authenticateKeyApi(request, reply, orderCreatePermissions),
      (request, reply) =>
        server.authenticateJwt(request, reply, orderCreatePermissions),
    ],
  });

  server.get('/orders/:orderNumber', {
    schema: ordersByNumberParamSchema,
    handler: orderController.findByNumber,
    preHandler: [
      (request, reply) =>
        server.authenticateKeyApi(request, reply, orderViewPermissions),
      (request, reply) =>
        server.authenticateJwt(request, reply, orderViewPermissions),
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
      (request, reply) =>
        server.authenticateJwt(
          request,
          reply,
          orderNumberPaymentViewPermissions
        ),
    ],
  });

  server.post('/orders/:orderNumber/cancel', {
    schema: postCancelOrderSchema,
    handler: orderController.cancelOrder,
    preHandler: [
      (request, reply) =>
        server.authenticateKeyApi(request, reply, orderNumberCancelPermissions),
      (request, reply) =>
        server.authenticateJwt(request, reply, orderNumberCancelPermissions),
    ],
  });

  server.post('/orders/:orderNumber/payments/boleto', {
    handler: orderController.paymentByBoleto,
    schema: postOrderPaymentBoletoSchema,
    preHandler: [
      (request, reply) =>
        server.authenticateKeyApi(
          request,
          reply,
          orderPaymentBoletoPermissions
        ),
      (request, reply) =>
        server.authenticateJwt(request, reply, orderPaymentBoletoPermissions),
    ],
  });

  server.post('/orders/:orderNumber/payments/credit-card', {
    handler: orderController.paymentByCreditCard,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
    schema: postOrderPaymentCardSchema,
  });

  server.post('/orders/:orderNumber/payments/pix', {
    handler: orderController.paymentByPix,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
  });
}
