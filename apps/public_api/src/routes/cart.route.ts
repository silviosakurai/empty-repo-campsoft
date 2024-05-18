import CartController from '@/controllers/cart';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import { cartCreatorSchemaValidation } from '@core/validations/cart';
import { cartCreatePermissions, cartReadPermissions } from '@/permissions';

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

  server.get('/cart/:cartId', {
    schema: cartCreatorSchemaValidation,
    handler: cartController.create,
    preHandler: [
      (request, reply) =>
        server.authenticateKeyApi(request, reply, cartReadPermissions),
      (request, reply) =>
        server.authenticateJwt(request, reply, cartReadPermissions),
    ],
  });
}
