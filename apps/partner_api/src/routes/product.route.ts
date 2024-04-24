import ProductController from '@/controllers/product';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import {
  getProductPartnerSchema,
  listProductByCompanySchema,
  postProductSchema,
  updateProductSchema,
  createProductImageSchema,
  postAddProductSchema,
  deleteProductFromGroupSchema,
  createProductGroupImageSchema,
  getProductGroupSchema,
  putProductGroupSchema,
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
    schema: updateProductSchema,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
    handler: productController.update,
  });

  server.post('/products/:sku/images/:type', {
    schema: createProductImageSchema,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
    handler: productController.createImage,
  });

  server.get('/product_groups/:groupId', {
    schema: getProductGroupSchema,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
    handler: productController.viewGroup,
  });
  
  server.post('/product_groups/:groupId/products', {
    schema: postAddProductSchema,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
    handler: productController.addProductToGroup,
  });

  server.put('/product_groups/:groupId', {
    schema: putProductGroupSchema,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
    handler: productController.putGroup,
  });

  server.delete('/product_groups/:groupId/products/:productId', {
    schema: deleteProductFromGroupSchema,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
    handler: productController.deleteProductFromGroup,
  });

  server.post('/product_groups/:groupId/images/:type', {
    schema: createProductGroupImageSchema,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
    handler: productController.createGroupImage,
  });
}
