import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import {
  listUserWithCompaniesSchema,
  userUpdaterByIdSchema,
} from '@core/validations/user';
import { listUserWithCompaniesSchema } from '@core/validations/user';
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

}
