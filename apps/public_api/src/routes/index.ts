import { FastifyInstance } from 'fastify';
import authRoutes from '@/routes/auth.route';
import { userRoutes } from './user.route';
import clientRoutes from '@/routes/client.route';

export default async function (server: FastifyInstance) {
  server.register(authRoutes);
  server.register(userRoutes);
  server.register(clientRoutes);
}
