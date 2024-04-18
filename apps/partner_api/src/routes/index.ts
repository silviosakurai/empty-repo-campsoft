import { FastifyInstance } from 'fastify';
import productRoutes from '@/routes/product.route';
import clientRoutes from '@/routes/client.route';
import planRoutes from '@/routes/plan.route';
import orderRoutes from '@/routes/order.route';

export default async function (server: FastifyInstance) {
  await server.register(productRoutes);
  await server.register(clientRoutes);
  await server.register(planRoutes);
  await server.register(orderRoutes);
}
