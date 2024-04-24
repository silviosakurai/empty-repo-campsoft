import ReviewsController from '@/controllers/reviews';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import { listReviewSchema } from '@core/validations/review';
import { reviewViewPermissions } from '@/permissions';

export default async function reviewRoutes(server: FastifyInstance) {
  const reviewController = container.resolve(ReviewsController);

  server.get('/reviews', {
    schema: listReviewSchema,
    handler: reviewController.list,
    preHandler: [
      (request, reply) =>
        server.authenticateKeyApi(request, reply, reviewViewPermissions),
    ],
  });
}
