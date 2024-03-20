import CartController from '@/controllers/cart';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';

export default async function cartRoutes(server: FastifyInstance) {
  const cartController = container.resolve(CartController);

  server.post('/cart', {
    handler: cartController.create,
  });
}
