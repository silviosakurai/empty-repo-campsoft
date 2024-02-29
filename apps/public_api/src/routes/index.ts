import { FastifyInstance } from 'fastify';
import clientRoutes from '@/routes/client.route';

export default async function (server: FastifyInstance) {
  server.register(clientRoutes);
}
