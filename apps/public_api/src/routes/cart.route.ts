import CartController from '@/controllers/cart';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import { cartCreatorSchemaValidation } from '@core/validations/cart';
import { cartCreatePermissions } from '@/permissions';

export default async function cartRoutes(server: FastifyInstance) {
  const cartController = container.resolve(CartController);

  server.post('/cart', {
    schema: cartCreatorSchemaValidation,
    handler: cartController.create,
    preHandler: [
      (request, reply) =>
        server.authenticateKeyApi(request, reply, cartCreatePermissions),
      (request, reply) =>
        server.authenticateJwt(request, reply, cartCreatePermissions),
    ],
  });
}
