import BannerController from '@/controllers/banner';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import { bannerReaderSchema } from '@core/validations/banner';
import { bannerListPermissions } from '@/permissions';

export default async function bannerRoutes(server: FastifyInstance) {
  const bannerController = container.resolve(BannerController);

  server.get('/banners', {
    schema: bannerReaderSchema,
    handler: bannerController.read,
    preHandler: [
      (request, reply) =>
        server.authenticateKeyApi(request, reply, bannerListPermissions),
    ],
  });
}
