import ProductController from '@/controllers/product';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import {
  listProductSchema,
  getProduct,
} from '@core/validations/product/product.validation';

export default async function productRoutes(server: FastifyInstance) {
  const productController = container.resolve(ProductController);

  server.get('/products', {
    schema: listProductSchema,
    preHandler: [server.authenticateKeyApi],
    handler: productController.list,
  });

  server.get('/products/:sku', {
    schema: getProduct,
    preHandler: [server.authenticateKeyApi],
    handler: productController.view,
  });
}
