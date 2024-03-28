import { FastifyInstance } from 'fastify';
import authRoutes from '@/routes/auth.route';
import clientRoutes from '@/routes/client.route';
import tfaRoutes from '@/routes/tfa.route';
import bannerRoutes from '@/routes/banner.route';
import productRoutes from '@/routes/product.route';
import planRoutes from '@/routes/plan.route';
import orderRoutes from '@/routes/order.route';
import vouchersRoutes from '@/routes/voucher.route';
import healthRoutes from '@/routes/health.route';

export default async function (server: FastifyInstance) {
  await server.register(authRoutes);
  await server.register(clientRoutes);
  await server.register(tfaRoutes);
  await server.register(bannerRoutes);
  await server.register(productRoutes);
  await server.register(planRoutes);
  await server.register(orderRoutes);
  await server.register(vouchersRoutes);
  await server.register(healthRoutes);
}
