import BannerController from '@/controllers/banner';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import {
  bannerListerManagerSchema,
  bannerViewerManagerSchema,
  bannerCreatorManagerSchema,
  bannerItemCreatorManagerSchema,
  bannerUpdaterManagerSchema,
  bannerItemUpdaterManagerSchema,
  bannerDeleterManagerSchema,
  bannerItemDeleterManagerSchema,
  bannerImageUploaderManagerSchema,
} from '@core/validations/banner';
import {
  bannerCreatePermissions,
  bannerDeletePermissions,
  bannerListPermissions,
  bannerUpdatePermissions,
  bannerViewPermissions,
} from '@/permissions';

export default async function bannerRoutes(server: FastifyInstance) {
  const bannerController = container.resolve(BannerController);

  server.get('/banners', {
    schema: bannerListerManagerSchema,
    handler: bannerController.list,
    preHandler: [
      (request, reply) =>
        server.authenticateJwt(request, reply, bannerListPermissions),
    ],
  });

  server.get('/banners/:bannerId', {
    schema: bannerViewerManagerSchema,
    handler: bannerController.view,
    preHandler: [
      (request, reply) =>
        server.authenticateJwt(request, reply, bannerViewPermissions),
    ],
  });

  server.post('/banners', {
    schema: bannerCreatorManagerSchema,
    handler: bannerController.create,
    preHandler: [
      (request, reply) =>
        server.authenticateJwt(request, reply, bannerCreatePermissions),
    ],
  });

  server.post('/banners/:bannerId/items', {
    schema: bannerItemCreatorManagerSchema,
    handler: bannerController.createItem,
    preHandler: [
      (request, reply) =>
        server.authenticateJwt(request, reply, bannerCreatePermissions),
    ],
  });

  server.post('/banners/:bannerId/items/:bannerItemId/images/:type', {
    schema: bannerImageUploaderManagerSchema,
    handler: bannerController.uploadBannerImage,
    preHandler: [
      (request, reply) =>
        server.authenticateJwt(request, reply, bannerCreatePermissions),
    ],
  });

  server.put('/banners/:bannerId', {
    schema: bannerUpdaterManagerSchema,
    handler: bannerController.update,
    preHandler: [
      (request, reply) =>
        server.authenticateJwt(request, reply, bannerUpdatePermissions),
    ],
  });

  server.put('/banners/:bannerId/items/:bannerItemId', {
    schema: bannerItemUpdaterManagerSchema,
    handler: bannerController.updateItem,
    preHandler: [
      (request, reply) =>
        server.authenticateJwt(request, reply, bannerUpdatePermissions),
    ],
  });

  server.delete('/banners/:bannerId', {
    schema: bannerDeleterManagerSchema,
    handler: bannerController.delete,
    preHandler: [
      (request, reply) =>
        server.authenticateJwt(request, reply, bannerDeletePermissions),
    ],
  });

  server.delete('/banners/:bannerId/items/:bannerItemId', {
    schema: bannerItemDeleterManagerSchema,
    handler: bannerController.deleteItem,
    preHandler: [
      (request, reply) =>
        server.authenticateJwt(request, reply, bannerDeletePermissions),
    ],
  });
}
