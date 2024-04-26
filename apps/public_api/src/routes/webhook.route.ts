import WebhookController from '@/controllers/webhook';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';

export default async function webhooksRoutes(server: FastifyInstance) {
  const controller = container.resolve(WebhookController);

  server.post('/webhook/payments', {
    handler: controller.paymentWebhook,
    websocket: true,
  });
}
