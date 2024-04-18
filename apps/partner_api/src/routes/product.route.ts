import ProductController from '@/controllers/product';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import {
  getProductPartnerSchema,
  listProductByCompanySchema,
  postProductSchema,
  updateProductSchema,
  createProductImageSchema,
} from '@core/validations/product';

export default async function productRoutes(server: FastifyInstance) {
  const productController = container.resolve(ProductController);

  server.get('/products', {
    schema: listProductByCompanySchema,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
    handler: productController.list,
  });

  server.get('/products/:sku', {
    schema: getProductPartnerSchema,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
    handler: productController.view,
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

  server.post('/products/:sku/images/:type', {
    handler: productController.createImage,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
    schema: createProductImageSchema,
  });
}
