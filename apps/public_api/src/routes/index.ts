import { FastifyInstance } from 'fastify';
import clientRoutes from '@/routes/client.route';
import authRoutes from '@/routes/auth.route';
import { userRoutes } from './user.route';

export default async function (server: FastifyInstance) {
  server.register(clientRoutes);
  server.register(authRoutes);
  server.register(userRoutes);
}
