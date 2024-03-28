import HealthController from '@/controllers/health';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';

export default async function healthRoutes(server: FastifyInstance) {
  const healthController = container.resolve(HealthController);

  server.get('/health-check', {
    handler: healthController.view,
  });
}
