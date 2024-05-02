import ClientController from '@/controllers/client';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import {
  getUserSchema,
  userCreatorSchema,
  userUpdateSchema,
  userDeleteSchema,
  userPhoneUpdaterSchema,
  userPasswordUpdaterSchema,
  userPasswordRecoveryMethodsSchema,
  userPasswordRecoveryUpdaterSchema,
  getUserVoucherSchema,
  getUserShippingAddressSchema,
  getUserBillingAddressSchema,
  putUserBillingAddressSchema,
  putUserShippingAddressSchema,
  userActivatePasswordSchema,
  patchUserShippingAddressSchema,
  patchUserImageSchemaSchema,
  createUserNewsletterSchema,
  createUserCreditCardSchema,
  updateUserCreditCardDefaultSchema,
} from '@core/validations/user';
import {
  userAddressBillingUpdatePermissions,
  userAddressBillingViewPermissions,
  userAddressShippingPatchPermissions,
  userAddressShippingUpdatePermissions,
  userAddressShippingViewPermissions,
  userCreatePermissions,
  userCreditCardCreatePermissions,
  userDeletePermissions,
  userImageUpdatePermissions,
  userNewsletterSubscribePermissions,
  userRecoveryPasswordPathPermissions,
  userRecoveryPasswordPermissions,
  userUpdatePasswordPermissions,
  userUpdatePermissions,
  userUpdatePhonePermissions,
  userViewPermissions,
  userVoucherPermissions,
  userCreditCardDefaultUpdatePermissions,
  userCreditCardDeletePermissions,
} from '@/permissions';

export default async function clientRoutes(server: FastifyInstance) {
  const clientController = container.resolve(ClientController);

  server.get('/user', {
    schema: getUserSchema,
    handler: clientController.view,
    preHandler: [
      (request, reply) =>
        server.authenticateKeyApi(request, reply, userViewPermissions),
      (request, reply) =>
        server.authenticateJwt(request, reply, userViewPermissions),
    ],
  });

  server.post('/user', {
    schema: userCreatorSchema,
    handler: clientController.create,
    preHandler: [
      (request, reply) =>
        server.authenticateKeyApi(request, reply, userCreatePermissions),
      (request, reply) => server.authenticateTfa(request, reply),
    ],
  });

  server.put('/user', {
    schema: userUpdateSchema,
    handler: clientController.update,
    preHandler: [
      (request, reply) =>
        server.authenticateKeyApi(request, reply, userUpdatePermissions),
      (request, reply) =>
        server.authenticateJwt(request, reply, userUpdatePermissions),
    ],
  });

  server.delete('/user', {
    schema: userDeleteSchema,
    handler: clientController.delete,
    preHandler: [
      (request, reply) =>
        server.authenticateKeyApi(request, reply, userDeletePermissions),
      (request, reply) =>
        server.authenticateJwt(request, reply, userDeletePermissions),
      (request, reply) => server.authenticateTfa(request, reply),
    ],
  });

  server.patch('/user/phone', {
    schema: userPhoneUpdaterSchema,
    handler: clientController.updatePhone,
    preHandler: [
      (request, reply) =>
        server.authenticateKeyApi(request, reply, userUpdatePhonePermissions),
      (request, reply) =>
        server.authenticateJwt(request, reply, userUpdatePhonePermissions),
      (request, reply) => server.authenticateTfa(request, reply),
    ],
  });

  server.patch('/user/password', {
    schema: userPasswordUpdaterSchema,
    handler: clientController.updatePassword,
    preHandler: [
      (request, reply) =>
        server.authenticateKeyApi(
          request,
          reply,
          userUpdatePasswordPermissions
        ),
      (request, reply) =>
        server.authenticateJwt(request, reply, userUpdatePasswordPermissions),
      (request, reply) => server.authenticateTfa(request, reply),
    ],
  });

  server.get('/user/recovery-password/:login', {
    schema: userPasswordRecoveryMethodsSchema,
    handler: clientController.passwordRecoveryMethods,
    preHandler: [
      (request, reply) =>
        server.authenticateKeyApi(
          request,
          reply,
          userRecoveryPasswordPermissions
        ),
    ],
  });

  server.patch('/user/recovery-password', {
    schema: userPasswordRecoveryUpdaterSchema,
    handler: clientController.updatePasswordRecovery,
    preHandler: [
      (request, reply) =>
        server.authenticateKeyApi(
          request,
          reply,
          userRecoveryPasswordPathPermissions
        ),
      (request, reply) => server.authenticateTfa(request, reply),
    ],
  });

  server.get('/user/vouchers/:voucherCode', {
    schema: getUserVoucherSchema,
    handler: clientController.viewVoucher,
    preHandler: [
      (request, reply) =>
        server.authenticateKeyApi(request, reply, userVoucherPermissions),
      (request, reply) =>
        server.authenticateJwt(request, reply, userVoucherPermissions),
    ],
  });

  server.get('/user/billing-address', {
    schema: getUserBillingAddressSchema,
    handler: clientController.getBillingAddress,
    preHandler: [
      (request, reply) =>
        server.authenticateKeyApi(
          request,
          reply,
          userAddressBillingViewPermissions
        ),
      (request, reply) =>
        server.authenticateJwt(
          request,
          reply,
          userAddressBillingViewPermissions
        ),
    ],
  });

  server.get('/user/shipping-address', {
    schema: getUserShippingAddressSchema,
    handler: clientController.getShippingAddress,
    preHandler: [
      (request, reply) =>
        server.authenticateKeyApi(
          request,
          reply,
          userAddressShippingViewPermissions
        ),
      (request, reply) =>
        server.authenticateJwt(
          request,
          reply,
          userAddressShippingViewPermissions
        ),
    ],
  });

  server.put('/user/billing-address', {
    schema: putUserBillingAddressSchema,
    handler: clientController.putBillingAddress,
    preHandler: [
      (request, reply) =>
        server.authenticateKeyApi(
          request,
          reply,
          userAddressBillingUpdatePermissions
        ),
      (request, reply) =>
        server.authenticateJwt(
          request,
          reply,
          userAddressBillingUpdatePermissions
        ),
    ],
  });

  server.put('/user/shipping-address', {
    schema: putUserShippingAddressSchema,
    handler: clientController.putShippingAddress,
    preHandler: [
      (request, reply) =>
        server.authenticateKeyApi(
          request,
          reply,
          userAddressShippingUpdatePermissions
        ),
      (request, reply) =>
        server.authenticateJwt(
          request,
          reply,
          userAddressShippingUpdatePermissions
        ),
    ],
  });

  server.patch('/user/email-activation/:token', {
    schema: userActivatePasswordSchema,
    handler: clientController.activateClientEmail,
  });

  server.patch('/user/shipping-address', {
    schema: patchUserShippingAddressSchema,
    handler: clientController.patchShippingAddress,
    preHandler: [
      (request, reply) =>
        server.authenticateKeyApi(
          request,
          reply,
          userAddressShippingPatchPermissions
        ),
      (request, reply) =>
        server.authenticateJwt(
          request,
          reply,
          userAddressShippingPatchPermissions
        ),
    ],
  });

  server.patch('/user/image', {
    schema: patchUserImageSchemaSchema,
    handler: clientController.patchImage,
    preHandler: [
      (request, reply) =>
        server.authenticateKeyApi(request, reply, userImageUpdatePermissions),
      (request, reply) =>
        server.authenticateJwt(request, reply, userImageUpdatePermissions),
    ],
  });

  server.post('/user/newsletter', {
    schema: createUserNewsletterSchema,
    handler: clientController.createClientNewsletter,
    preHandler: [
      (request, reply) =>
        server.authenticateKeyApi(
          request,
          reply,
          userNewsletterSubscribePermissions
        ),
      (request, reply) =>
        server.authenticateJwt(
          request,
          reply,
          userNewsletterSubscribePermissions
        ),
    ],
  });

  server.post('/user/credit-card', {
    schema: createUserCreditCardSchema,
    handler: clientController.createCardClient,
    preHandler: [
      (request, reply) =>
        server.authenticateKeyApi(
          request,
          reply,
          userCreditCardCreatePermissions
        ),
      (request, reply) =>
        server.authenticateJwt(request, reply, userCreditCardCreatePermissions),
    ],
  });

  server.patch('/user/credit-card/:id/default', {
    schema: updateUserCreditCardDefaultSchema,
    handler: clientController.updateUserCreditCardDefault,
    preHandler: [
      (request, reply) =>
        server.authenticateKeyApi(
          request,
          reply,
          userCreditCardDefaultUpdatePermissions
        ),
      (request, reply) =>
        server.authenticateJwt(
          request,
          reply,
          userCreditCardDefaultUpdatePermissions
        ),
    ],
  });

  server.delete('/user/credit-card/:id', {
    handler: clientController.eraseCardClient,
    preHandler: [
      (request, reply) =>
        server.authenticateKeyApi(
          request,
          reply,
          userCreditCardDeletePermissions
        ),
      (request, reply) =>
        server.authenticateJwt(request, reply, userCreditCardDeletePermissions),
    ],
  });
}
