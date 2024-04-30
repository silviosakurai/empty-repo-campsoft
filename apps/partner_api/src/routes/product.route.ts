import ProductController from '@/controllers/product';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import {
  getProductPartnerSchema,
  listProductByCompanySchema,
  postProductSchema,
  updateProductDetailHowToAccessSchema,
  updateProductSchema,
  createProductImageSchema,
  postAddProductSchema,
  deleteProductFromGroupSchema,
  createProductGroupImageSchema,
  getProductGroupSchema,
  putProductGroupSchema,
} from '@core/validations/product';
import {
  productCreatePermissions,
  productImageGroupUpdatePermissions,
  productListPermissions,
  productUpdatePermissions,
  productViewPermissions,
} from '@/permissions';

export default async function productRoutes(server: FastifyInstance) {
  const productController = container.resolve(ProductController);

  server.get('/products', {
    schema: listProductByCompanySchema,
    handler: productController.list,
    preHandler: [
      (request, reply) =>
        server.authenticateJwt(request, reply, productListPermissions),
    ],
  });

  server.get('/products/:sku', {
    schema: getProductPartnerSchema,
    handler: productController.view,
    preHandler: [
      (request, reply) =>
        server.authenticateJwt(request, reply, productViewPermissions),
    ],
  });

  server.post('/products', {
    schema: postProductSchema,
    handler: productController.post,
    preHandler: [
      (request, reply) =>
        server.authenticateJwt(request, reply, productCreatePermissions),
    ],
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

  server.put('/products/:sku', {
    schema: updateProductSchema,
    handler: productController.update,
    preHandler: [
      (request, reply) =>
        server.authenticateJwt(request, reply, productUpdatePermissions),
    ],
  });

  server.post('/products/:sku/images/:type', {
    schema: createProductImageSchema,
    handler: productController.createImage,
    preHandler: [
      (request, reply) =>
        server.authenticateJwt(
          request,
          reply,
          productImageGroupUpdatePermissions
        ),
    ],
  });

  server.get('/product_groups/:groupId', {
    schema: getProductGroupSchema,
    handler: productController.viewGroup,
    preHandler: [
      (request, reply) =>
        server.authenticateJwt(request, reply, productViewPermissions),
    ],
  });

  server.post('/product_groups/:groupId/products', {
    schema: postAddProductSchema,
    handler: productController.addProductToGroup,
    preHandler: [
      (request, reply) =>
        server.authenticateJwt(request, reply, productCreatePermissions),
    ],
  });

  server.put('/product_groups/:groupId', {
    schema: putProductGroupSchema,
    handler: productController.putGroup,
    preHandler: [
      (request, reply) =>
        server.authenticateJwt(request, reply, productUpdatePermissions),
    ],
  });

  server.delete('/product_groups/:groupId/products/:productId', {
    schema: deleteProductFromGroupSchema,
    handler: productController.deleteProductFromGroup,
    preHandler: [
      (request, reply) =>
        server.authenticateJwt(request, reply, productUpdatePermissions),
    ],
  });

  server.post('/product_groups/:groupId/images/:type', {
    schema: createProductGroupImageSchema,
    handler: productController.createGroupImage,
    preHandler: [
      (request, reply) =>
        server.authenticateJwt(request, reply, productUpdatePermissions),
    ],
  });
}
