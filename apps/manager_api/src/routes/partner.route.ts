import PartnerController from '@/controllers/partner';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import {
  listPartnerSchema,
  createPartnerSchema,
  updatePartnerSchema,
  deletePartnerSchema,
  listProductByPartnerSchema,
  postAddProductToPartnerSchema,
  deleteProductFromPartnerSchema,
} from '@core/validations/partner';
import {
  partnerListPermissions,
  partnerCreatePermissions,
  partnerUpdatePermissions,
  partnerDeletePermissions,
} from '@/permissions';

export default async function partnerRoutes(server: FastifyInstance) {
  const partnerController = container.resolve(PartnerController);

  server.get('/partner', {
    schema: listPartnerSchema,
    handler: partnerController.list,
    preHandler: [
      (request, reply) =>
        server.authenticateJwt(request, reply, partnerListPermissions),
    ],
  });

  server.post('/partner', {
    schema: createPartnerSchema,
    handler: partnerController.create,
    preHandler: [
      (request, reply) =>
        server.authenticateJwt(request, reply, partnerCreatePermissions),
    ],
  });

  server.put('/partner/:partnerId', {
    schema: updatePartnerSchema,
    handler: partnerController.update,
    preHandler: [
      (request, reply) =>
        server.authenticateJwt(request, reply, partnerUpdatePermissions),
    ],
  });

  server.delete('/partner/:partnerId', {
    schema: deletePartnerSchema,
    handler: partnerController.delete,
    preHandler: [
      (request, reply) =>
        server.authenticateJwt(request, reply, partnerDeletePermissions),
    ],
  });
  
  server.get('/partner/:partnerId/products', {
    schema: listProductByPartnerSchema,
    handler: partnerController.listProduct,
    preHandler: [
      (request, reply) =>
        server.authenticateJwt(request, reply, partnerListPermissions),
    ],
  });

  server.post('/partner/:partnerId/products', {
    schema: postAddProductToPartnerSchema,
    handler: partnerController.addProduct,
    preHandler: [
      (request, reply) =>
        server.authenticateJwt(request, reply, partnerCreatePermissions),
    ],
  });

  server.delete('/partner/:partnerId/products/:productId', {
    schema: deleteProductFromPartnerSchema,
    handler: partnerController.deleteProductFromPartner,
    preHandler: [
      (request, reply) =>
        server.authenticateJwt(request, reply, partnerDeletePermissions),
    ],
  });
}
