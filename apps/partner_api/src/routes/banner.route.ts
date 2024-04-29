import BannerController from '@/controllers/banner';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import {
  bannerListerPartnerSchema,
  bannerViewerPartnerSchema,
  bannerCreatorPartnerSchema,
  bannerItemCreatorPartnerSchema,
  bannerUpdaterPartnerSchema,
  bannerItemUpdaterPartnerSchema,
  bannerDeleterPartnerSchema,
  bannerItemDeleterPartnerSchema,
  bannerImageUploaderPartnerSchema,
} from '@core/validations/banner';
import { bannerCreatePermissions, bannerDeletePermissions, bannerListPermissions, bannerUpdatePermissions, bannerViewPermissions } from '@/permissions';

export default async function bannerRoutes(server: FastifyInstance) {
  const bannerController = container.resolve(BannerController);

  server.get('/banners', {
    schema: bannerListerPartnerSchema,
    handler: bannerController.list,
    preHandler: [
      (request, reply) =>
        server.authenticateJwt(request, reply, bannerListPermissions),
    ],
  });

  server.get('/banners/:bannerId', {
    schema: bannerViewerPartnerSchema,
    handler: bannerController.view,
    preHandler: [
      (request, reply) =>
        server.authenticateJwt(request, reply, bannerViewPermissions),
    ],
  });

  server.post('/banners', {
    schema: bannerCreatorPartnerSchema,
    handler: bannerController.create,
    preHandler: [
      (request, reply) =>
        server.authenticateJwt(request, reply, bannerCreatePermissions),
    ],
  });

  server.post('/banners/:bannerId/items', {
    schema: bannerItemCreatorPartnerSchema,
    handler: bannerController.createItem,
    preHandler: [
      (request, reply) =>
        server.authenticateJwt(request, reply, bannerCreatePermissions),
    ],
  });

  server.post('/banners/:bannerId/items/:bannerItemId/images/:type', {
    schema: bannerImageUploaderPartnerSchema,
    handler: bannerController.uploadBannerImage,
    preHandler: [
      (request, reply) =>
        server.authenticateJwt(request, reply, bannerCreatePermissions),
    ],
  });

  server.put('/banners/:bannerId', {
    schema: bannerUpdaterPartnerSchema,
    handler: bannerController.update,
    preHandler: [
      (request, reply) =>
        server.authenticateJwt(request, reply, bannerUpdatePermissions),
    ],
  });

  server.put('/banners/:bannerId/items/:bannerItemId', {
    schema: bannerItemUpdaterPartnerSchema,
    handler: bannerController.updateItem,
    preHandler: [
      (request, reply) =>
        server.authenticateJwt(request, reply, bannerUpdatePermissions),
    ],
  });

  server.delete('/banners/:bannerId', {
    schema: bannerDeleterPartnerSchema,
    handler: bannerController.delete,
    preHandler: [
      (request, reply) =>
        server.authenticateJwt(request, reply, bannerDeletePermissions),
    ],
  });

  server.delete('/banners/:bannerId/items/:bannerItemId', {
    schema: bannerItemDeleterPartnerSchema,
    handler: bannerController.deleteItem,
    preHandler: [
      (request, reply) =>
        server.authenticateJwt(request, reply, bannerDeletePermissions),
    ],
  });
}
