import { FastifyInstance } from 'fastify';
import productRoutes from '@/routes/product.route';
import clientRoutes from './client.route';

export default async function (server: FastifyInstance) {
  await server.register(productRoutes);
  await server.register(clientRoutes);
}
