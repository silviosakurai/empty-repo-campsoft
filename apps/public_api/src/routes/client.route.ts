import ClientController from '@/controllers/client';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import {
  userCreatorSchema,
  userUpdaterSchema,
  userPhoneUpdaterSchema,
  userPasswordUpdaterSchema,
  userPasswordRecoveryMethods,
  userPasswordRecoveryUpdaterSchema,
} from '@core/validations/user/user.validation';

export default async function clientRoutes(server: FastifyInstance) {
  const clientController = container.resolve(ClientController);

  server.get('/user', {
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
    handler: clientController.update,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
  });

  server.patch('/user/phone', {
    schema: userPhoneUpdaterSchema,
    handler: clientController.updatePhone,
    preHandler: [
      server.authenticateKeyApi,
      server.authenticateJwt,
      server.authenticateTfa,
    ],
  });

  server.patch('/user/password', {
    schema: userPasswordUpdaterSchema,
    handler: clientController.updatePassword,
    preHandler: [
      server.authenticateKeyApi,
      server.authenticateJwt,
      server.authenticateTfa,
    ],
  });

  server.get('/user/recovery-password/:login', {
    schema: userPasswordRecoveryMethods,
    handler: clientController.passwordRecoveryMethods,
    preHandler: [server.authenticateKeyApi],
  });

  server.patch('/user/recovery-password', {
    schema: userPasswordRecoveryUpdaterSchema,
    handler: clientController.updatePasswordRecovery,
    preHandler: [server.authenticateKeyApi, server.authenticateTfa],
  });
}
