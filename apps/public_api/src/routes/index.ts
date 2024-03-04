import { FastifyInstance } from 'fastify';
import clientRoutes from '@/routes/client.route';
import { userRoutes } from './user.route';

export default async function (server: FastifyInstance) {
  server.register(clientRoutes);
  server.register(userRoutes);
}
