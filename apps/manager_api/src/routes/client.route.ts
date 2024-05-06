import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import {
  getUserByIdSchema,
  listUserWithCompaniesSchema,
  userCreatorPartnerSchema,
  userDeleteByIdSchema,
  userSendSsoSchema,
  userUpdateByIdSchema,
} from '@core/validations/user';
import ClientController from '../controllers/client';
import {
  userDeletePermissions,
  userListPermissions,
  userSendSsoPermissions,
  userViewPermissions,
} from '../permissions';

export default async function clientRoutes(server: FastifyInstance) {
  const clientController = container.resolve(ClientController);

  server.get('/users', {
    schema: listUserWithCompaniesSchema,
    handler: clientController.list,
    preHandler: [
      (request, reply) =>
        server.authenticateJwt(request, reply, userListPermissions),
    ],
  });

  server.post('/users', {
    schema: userCreatorPartnerSchema,
    handler: clientController.create,
    preHandler: [
      (request, reply) =>
        server.authenticateJwt(request, reply, userListPermissions),
    ],
  });

  server.put('/users/:userId', {
    schema: userUpdateByIdSchema,
    handler: clientController.update,
    preHandler: [
      (request, reply) =>
        server.authenticateJwt(request, reply, userViewPermissions),
    ],
  });

  server.patch('/users/:userId/send-sso', {
    schema: userSendSsoSchema,
    preHandler: [
      (request, reply) =>
        server.authenticateJwt(request, reply, userSendSsoPermissions),
    ],
    handler: clientController.sendSso,
  });

  server.get('/users/:userId', {
    schema: getUserByIdSchema,
    preHandler: [
      (request, reply) =>
        server.authenticateJwt(request, reply, userViewPermissions),
    ],
    handler: clientController.view,
  });

  server.delete('/users/:userId', {
    schema: userDeleteByIdSchema,
    preHandler: [
      (request, reply) =>
        server.authenticateJwt(request, reply, userDeletePermissions),
    ],
    handler: clientController.delete,
  });
}
