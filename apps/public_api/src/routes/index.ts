import healthRoutes from '@/routes/health.route';
import { FastifyInstance } from 'fastify';

export default async function (server: FastifyInstance) {
  await server.register(healthRoutes);
}
