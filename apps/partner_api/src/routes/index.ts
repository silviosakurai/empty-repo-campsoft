import { FastifyInstance } from 'fastify';
import productRoutes from '@/routes/product.route';

export default async function (server: FastifyInstance) {
  await server.register(productRoutes);
}
