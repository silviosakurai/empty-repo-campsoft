import OrderController from '@/controllers/order';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import { ordersFromManagersSchema } from '@core/validations/order';
import { orderListPermissions } from '@/permissions';

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
}
