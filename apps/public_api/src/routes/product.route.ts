import ProductController from '@/controllers/product';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import {
  getProductCrossSellSchema,
  getProductSchema,
  listProductSchema,
} from '@core/validations/product';
import {
  productCrossSellPermissions,
  productViewPermissions,
  productListPermissions,
} from '@/permissions';

export default async function productRoutes(server: FastifyInstance) {
  const productController = container.resolve(ProductController);

  server.get('/products', {
    schema: listProductSchema,
    handler: productController.list,
    preHandler: [
      (request, reply) =>
        server.authenticateKeyApi(request, reply, productListPermissions),
    ],
  });

  server.get('/products/:slug', {
    schema: getProductSchema,
    handler: productController.view,
    preHandler: [
      (request, reply) =>
        server.authenticateKeyApi(request, reply, productViewPermissions),
    ],
  });

  server.get('/products/cross-sell', {
    schema: getProductCrossSellSchema,
    handler: productController.listCrossSell,
    preHandler: [
      (request, reply) =>
        server.authenticateKeyApi(request, reply, productCrossSellPermissions),
      (request, reply) =>
        server.authenticateJwt(request, reply, productCrossSellPermissions),
    ],
  });
}
