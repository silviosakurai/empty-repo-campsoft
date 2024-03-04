import { FastifyInstance } from 'fastify';
import clientRoutes from '@/routes/client.route';
import authRoutes from '@/routes/auth.route';

export default async function (server: FastifyInstance) {
  server.register(clientRoutes);
  server.register(authRoutes);
}
