import WebhookController from '@/controllers/webhook';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';

export default async function webhooksRoutes(app: FastifyInstance) {
  const controller = container.resolve(WebhookController);

  app.post('/webhook/payments', {
    handler: controller.paymentWebhook,
  });
}
