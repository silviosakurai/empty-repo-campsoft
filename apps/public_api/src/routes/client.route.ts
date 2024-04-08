import ClientController from '@/controllers/client';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import {
  getUserSchema,
  userCreatorSchema,
  userUpdaterSchema,
  userDeleteSchema,
  userPhoneUpdaterSchema,
  userPasswordUpdaterSchema,
  userPasswordRecoveryMethodsSchema,
  userPasswordRecoveryUpdaterSchema,
  getUserVoucherSchema,
  createUserNewsletterSchema,
  getUserShippingAddressSchema,
  getUserBillingAddressSchema,
  putUserBillingAddressSchema,
  putUserShippingAddressSchema,
} from '@core/validations/user';

export default async function clientRoutes(server: FastifyInstance) {
  const clientController = container.resolve(ClientController);

  server.get('/user', {
    schema: getUserSchema,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
    handler: clientController.view,
  });

  server.post('/user', {
    schema: userCreatorSchema,
    preHandler: [server.authenticateKeyApi, server.authenticateTfa],
    handler: clientController.create,
  });

  server.put('/user', {
    schema: userUpdaterSchema,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
    handler: clientController.update,
  });

  server.delete('/user', {
    schema: userDeleteSchema,
    preHandler: [
      server.authenticateKeyApi,
      server.authenticateJwt,
      server.authenticateTfa,
    ],
    handler: clientController.delete,
  });

  server.patch('/user/phone', {
    schema: userPhoneUpdaterSchema,
    preHandler: [
      server.authenticateKeyApi,
      server.authenticateJwt,
      server.authenticateTfa,
    ],
    handler: clientController.updatePhone,
  });

  server.patch('/user/password', {
    schema: userPasswordUpdaterSchema,
    preHandler: [
      server.authenticateKeyApi,
      server.authenticateJwt,
      server.authenticateTfa,
    ],
    handler: clientController.updatePassword,
  });

  server.get('/user/recovery-password/:login', {
    schema: userPasswordRecoveryMethodsSchema,
    preHandler: [server.authenticateKeyApi],
    handler: clientController.passwordRecoveryMethods,
  });

  server.patch('/user/recovery-password', {
    schema: userPasswordRecoveryUpdaterSchema,
    preHandler: [server.authenticateKeyApi, server.authenticateTfa],
    handler: clientController.updatePasswordRecovery,
  });

  server.get('/user/vouchers/:voucherCode', {
    schema: getUserVoucherSchema,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
    handler: clientController.viewVoucher,
  });

  server.post('/user/newsletter', {
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
    handler: clientController.createClientNewsletter,
    schema: createUserNewsletterSchema,
  });

  server.get('/user/billing-address', {
    schema: getUserBillingAddressSchema,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
    handler: clientController.getBillingAddress,
  });

  server.get('/user/shipping-address', {
    schema: getUserShippingAddressSchema,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
    handler: clientController.getShippingAddress,
  });

  server.put('/user/billing-address', {
    schema: putUserBillingAddressSchema,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
    handler: clientController.putBillingAddress,
  });

  server.put('/user/shipping-address', {
    schema: putUserShippingAddressSchema,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
    handler: clientController.putShippingAddress,
  });
}
