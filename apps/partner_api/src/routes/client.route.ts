import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import {
  listUserWithCompaniesSchema,
  userUpdaterByIdSchema,
} from '@core/validations/user';
import ClientController from '@/controllers/client';
import { userListPermissions, userViewPermissions } from '@/permissions';

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

  server.put('/users/:userId', {
    schema: userUpdaterByIdSchema,
    handler: clientController.update,
    preHandler: [
      (request, reply) =>
        server.authenticateJwt(request, reply, userViewPermissions),
    ],
  });
}
