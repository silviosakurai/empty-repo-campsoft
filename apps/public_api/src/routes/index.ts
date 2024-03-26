import { FastifyInstance } from 'fastify';
import authRoutes from '@/routes/auth.route';
import clientRoutes from '@/routes/client.route';
import tfaRoutes from '@/routes/tfa.route';
import bannerRoutes from '@/routes/banner.route';
import productRoutes from '@/routes/product.route';
import planRoutes from '@/routes/plan.route';
import cartRoutes from './cart.route';
import orderRoutes from '@/routes/order.route';
import vouchersRoutes from '@/routes/voucher.route';
import healthRoutes from '@/routes/health.route';

export default async function (server: FastifyInstance) {
  server.register(authRoutes);
  server.register(clientRoutes);
  server.register(tfaRoutes);
  server.register(bannerRoutes);
  server.register(productRoutes);
  server.register(planRoutes);
  server.register(cartRoutes);
  server.register(orderRoutes);
  server.register(vouchersRoutes);
  server.register(healthRoutes);
}
