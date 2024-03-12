import { FastifyInstance } from 'fastify';
import authRoutes from '@/routes/auth.route';
import clientRoutes from '@/routes/client.route';
import tfaRoutes from '@/routes/tfa.route';
import bannerRoutes from './banner.route';

export default async function (server: FastifyInstance) {
  server.register(authRoutes);
  server.register(clientRoutes);
  server.register(tfaRoutes);
  server.register(bannerRoutes);
}
