import CartController from '@/controllers/cart';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import {
  cartCreatorSchemaValidation,
  cartEditSchema,
  cartListSchema,
} from '@core/validations/cart';
import {
  cartCreatePermissions,
  cartReadPermissions,
  cartUpdatePermissions,
} from '@/permissions';

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

  server.put('/cart/:cartId', {
    schema: cartEditSchema,
    handler: cartController.findCartById,
    preHandler: [
      (request, reply) =>
        server.authenticateKeyApi(request, reply, cartUpdatePermissions),
      (request, reply) =>
        server.authenticateJwt(request, reply, cartUpdatePermissions),
    ],
  });

  server.get('/cart/:cartId', {
    schema: cartListSchema,
    handler: cartController.findCartById,
    preHandler: [
      (request, reply) =>
        server.authenticateKeyApi(request, reply, cartReadPermissions),
      (request, reply) =>
        server.authenticateJwt(request, reply, cartReadPermissions),
    ],
  });
}
