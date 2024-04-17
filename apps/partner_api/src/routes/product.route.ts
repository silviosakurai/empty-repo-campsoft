import ProductController from '@/controllers/product';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import {
  listProductByCompanySchema,
  postProductSchema,
  updateProductDetailHowToAccessSchema,
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

  server.put('/products/:sku/how-to-access', {
    schema: updateProductDetailHowToAccessSchema,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
    handler: productController.updateDetail,
  });

  server.delete('/products/:sku/how-to-access', {
    schema: updateProductDetailHowToAccessSchema,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
    handler: productController.updateDetail,
  });
}
