import OrderController from '@/controllers/order';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import { ordersFromManagersSchema, createOrderByManagerSchema } from '@core/validations/order';
import { orderListPermissions, orderCreatePermissions } from '@/permissions';

export default async function orderRoutes(server: FastifyInstance) {
  const orderController = container.resolve(OrderController);

  server.get('/orders', {
    schema: ordersFromManagersSchema,
    handler: orderController.list,
    preHandler: [
      (request, reply) =>
        server.authenticateJwt(request, reply, orderListPermissions),
    ],
  });

  server.post('/orders', {
    schema: createOrderByManagerSchema,
    handler: orderController.create,
    preHandler: [
      (request, reply) =>
        server.authenticateKeyApi(request, reply, orderCreatePermissions),
      (request, reply) =>
        server.authenticateJwt(request, reply, orderCreatePermissions),
    ],
  });
}
