import CartController from '@/controllers/cart';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import { cartCreatorSchemaValidation } from '@core/validations/cart';

export default async function cartRoutes(server: FastifyInstance) {
  const cartController = container.resolve(CartController);

  server.post('/cart', {
    handler: cartController.create,
    schema: cartCreatorSchemaValidation,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
  });
}
