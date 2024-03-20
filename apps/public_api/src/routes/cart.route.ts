import CartController from '@/controllers/cart';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import { createCartSchema } from '@core/validations/cart/cart.validation';

export default async function cartRoutes(server: FastifyInstance) {
  const cartController = container.resolve(CartController);

  server.post('/cart', {
    handler: cartController.create,
    schema: createCartSchema,
  });
}
