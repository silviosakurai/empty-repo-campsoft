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

export default async function bannerRoutes(server: FastifyInstance) {
  const bannerController = container.resolve(BannerController);

  server.get('/banners', {
    schema: bannerListerPartnerSchema,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
    handler: bannerController.list,
  });

  server.get('/banners/:bannerId', {
    schema: bannerViewerPartnerSchema,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
    handler: bannerController.view,
  });

  server.post('/banners', {
    schema: bannerCreatorPartnerSchema,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
    handler: bannerController.create,
  });

  server.post('/banners/:bannerId/items', {
    schema: bannerItemCreatorPartnerSchema,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
    handler: bannerController.createItem,
  });

  server.post('/banners/:bannerId/items/:bannerItemId/images/:type', {
    schema: bannerImageUploaderPartnerSchema,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
    handler: bannerController.uploadBannerImage,
  });

  server.put('/banners/:bannerId', {
    schema: bannerUpdaterPartnerSchema,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
    handler: bannerController.update,
  });

  server.put('/banners/:bannerId/items/:bannerItemId', {
    schema: bannerItemUpdaterPartnerSchema,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
    handler: bannerController.updateItem,
  });

  server.delete('/banners/:bannerId', {
    schema: bannerDeleterPartnerSchema,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
    handler: bannerController.delete,
  });

  server.delete('/banners/:bannerId/items/:bannerItemId', {
    schema: bannerItemDeleterPartnerSchema,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
    handler: bannerController.deleteItem,
  });
}
