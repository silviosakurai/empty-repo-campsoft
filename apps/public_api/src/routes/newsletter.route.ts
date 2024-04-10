import NewsletterController from '@/controllers/newsletter';
import { createUserNewsletterSchema } from '@core/validations/user';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';

export default async function newsletterRoutes(server: FastifyInstance) {
  const newsletterController = container.resolve(NewsletterController);

  server.post('/user/newsletter', {
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
    handler: newsletterController.create,
    schema: createUserNewsletterSchema,
  });
}
