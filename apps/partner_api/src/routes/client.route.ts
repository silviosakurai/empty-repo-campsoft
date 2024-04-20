import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import {
  getUserByIdSchema,
  listUserWithCompaniesSchema,
  userUpdaterByIdSchema,
} from '@core/validations/user';
import ClientController from '@/controllers/client';

export default async function clientRoutes(server: FastifyInstance) {
  const clientController = container.resolve(ClientController);

  server.get('/users', {
    schema: listUserWithCompaniesSchema,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
    handler: clientController.list,
  });

  server.put('/users/:userId', {
    schema: userUpdaterByIdSchema,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
    handler: clientController.update,
  });

  server.get('/users/:userId', {
    schema: getUserByIdSchema,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
    handler: clientController.view,
  });
}
