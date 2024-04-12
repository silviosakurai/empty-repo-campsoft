import ProductController from '@/controllers/product';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import {
  listProductByCompanySchema,
  postProductSchema,
  updateProductSchema,
} from '@core/validations/product';

export default async function productRoutes(server: FastifyInstance) {
  const productController = container.resolve(ProductController);

  server.get('/products', {
    schema: listProductByCompanySchema,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
    handler: productController.list,
  });

  server.post('/products', {
    schema: postProductSchema,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
    handler: productController.post,
  });

  server.put('/products/:sku', {
    handler: productController.update,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
    schema: updateProductSchema,
  });
}
