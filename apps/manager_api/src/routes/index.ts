import { FastifyInstance } from 'fastify';
import authRoutes from '@/routes/auth.route';
import productRoutes from '@/routes/product.route';
import clientRoutes from '@/routes/client.route';
import planRoutes from '@/routes/plan.route';
import orderRoutes from '@/routes/order.route';
import bannerRoutes from '@/routes/banner.route';

export default async function (server: FastifyInstance) {
  await server.register(authRoutes);
  await server.register(productRoutes);
  await server.register(clientRoutes);
  await server.register(planRoutes);
  await server.register(orderRoutes);
  await server.register(bannerRoutes);
}
