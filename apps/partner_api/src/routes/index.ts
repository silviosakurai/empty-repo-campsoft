import { FastifyInstance } from 'fastify';
import productRoutes from '@/routes/product.route';
import planRoutes from '@/routes/plan.route';

export default async function (server: FastifyInstance) {
  await server.register(productRoutes);
  await server.register(planRoutes);
}
