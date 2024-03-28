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
    preHandler: [server.authenticateKeyApi],
    handler: productController.list,
  });

  server.get('/products/:sku', {
    schema: getProductSchema,
    preHandler: [server.authenticateKeyApi],
    handler: productController.view,
  });

  server.get('/products/cross-sell', {
    schema: getProductCrossSellSchema,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
    handler: productController.listCrossSell,
  });
}
