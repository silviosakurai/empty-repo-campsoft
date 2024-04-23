import ProductController from '@/controllers/product';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import {
  getProductCrossSellSchema,
  getProductSchema,
  listProductSchema,
} from '@core/validations/product';

export default async function productRoutes(server: FastifyInstance) {
  const productController = container.resolve(ProductController);

  server.get('/products', {
    schema: listProductSchema,
    handler: productController.list,
    preHandler: [
      (request, reply) => server.authenticateKeyApi(request, reply, null),
    ],
  });

  server.get('/products/:sku', {
    schema: getProductSchema,
    handler: productController.view,
    preHandler: [
      (request, reply) => server.authenticateKeyApi(request, reply, null),
    ],
  });

  server.get('/products/cross-sell', {
    schema: getProductCrossSellSchema,
    handler: productController.listCrossSell,
    preHandler: [
      (request, reply) => server.authenticateKeyApi(request, reply, null),
      (request, reply) => server.authenticateJwt(request, reply),
    ],
  });
}
