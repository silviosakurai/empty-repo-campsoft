import NewsletterController from '@/controllers/newsletter';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import {
  activateEmailSchema,
  newsletterSchema,
} from '@core/validations/newsletter';
import { newsletterSubscribePermissions } from '@/permissions';

export default async function newsletterRoutes(server: FastifyInstance) {
  const newsletterController = container.resolve(NewsletterController);

  server.post('/newsletter', {
    schema: newsletterSchema,
    handler: newsletterController.createNewsletter,
    preHandler: [
      (request, reply) =>
        server.authenticateKeyApi(
          request,
          reply,
          newsletterSubscribePermissions
        ),
    ],
  });

  server.patch('/newsletter/email-activation/:token', {
    schema: activateEmailSchema,
    handler: newsletterController.activateEmail,
    preHandler: [
      (request, reply) =>
        server.authenticateKeyApi(
          request,
          reply,
          newsletterSubscribePermissions
        ),
    ],
  });
}
