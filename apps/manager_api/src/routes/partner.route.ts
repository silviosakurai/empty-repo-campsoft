import PartnerController from '@/controllers/partner';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import {
  deleteProductFromPartnerSchema,
  listProductByPartnerSchema,
  postAddProductToPartnerSchema,
} from '@core/validations/partner';
import {
  partnerCreatePermissions,
  partnerDeletePermissions,
  partnerListPermissions,
} from '@/permissions';

export default async function partnerRoutes(server: FastifyInstance) {
  const partnerController = container.resolve(PartnerController);

  server.get('/partner/:partnerId/products', {
    schema: listProductByPartnerSchema,
    handler: partnerController.list,
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
    handler: partnerController.deleteFromPartner,
    preHandler: [
      (request, reply) =>
        server.authenticateJwt(request, reply, partnerDeletePermissions),
    ],
  });
}
