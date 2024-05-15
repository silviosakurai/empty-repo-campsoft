import OrderController from '@/controllers/order';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import {
  getPaymentsSchema,
  postCancelOrderSchema,
  ordersByNumberParamSchema,
  createOrderSchema,
  postOrderPaymentBoletoSchema,
  postOrderPaymentCardSchema,
  postOrderPaymentPixSchema,
  ordersHistoricByNumberParamSchema,
  ordersWithRecurrenceSchema,
} from '@core/validations/order';
import {
  orderCreatePermissions,
  orderNumberCancelPermissions,
  orderNumberPaymentViewPermissions,
  orderViewPermissions,
  orderPaymentBoletoPermissions,
  orderPaymentCreditCardPermissions,
  orderPaymentPixPermissions,
  orderListPermissions,
  orderHistoricViewPermissions,
} from '@/permissions';

export default async function orderRoutes(server: FastifyInstance) {
  const orderController = container.resolve(OrderController);

  server.get('/orders', {
    schema: ordersWithRecurrenceSchema,
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
    schema: postOrderPaymentCardSchema,
    preHandler: [
      (request, reply) =>
        server.authenticateKeyApi(
          request,
          reply,
          orderPaymentCreditCardPermissions
        ),
      (request, reply) =>
        server.authenticateJwt(
          request,
          reply,
          orderPaymentCreditCardPermissions
        ),
    ],
  });

  server.post('/orders/:orderNumber/payments/pix', {
    handler: orderController.paymentByPix,
    preHandler: [
      (request, reply) =>
        server.authenticateKeyApi(request, reply, orderPaymentPixPermissions),
      (request, reply) =>
        server.authenticateJwt(request, reply, orderPaymentPixPermissions),
    ],
    schema: postOrderPaymentPixSchema,
  });

  server.get('/orders/:orderNumber/historic', {
    schema: ordersHistoricByNumberParamSchema,
    handler: orderController.viewPaymentHistoric,
    preHandler: [
      (request, reply) =>
        server.authenticateKeyApi(request, reply, orderHistoricViewPermissions),
      (request, reply) =>
        server.authenticateJwt(request, reply, orderHistoricViewPermissions),
    ],
  });
}
