import { FastifyInstance } from 'fastify';
import webhooksRoutes from '@/routes/webhook.route';

export default async function (server: FastifyInstance) {
  await server.register(webhooksRoutes);
}
