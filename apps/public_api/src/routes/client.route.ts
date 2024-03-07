import ClientController from '@/controllers/client';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import {
  userCreatorSchema,
  userUpdaterSchema,
  userViewSchema,
} from '@core/validations/user/user.validation';

export default async function clientRoutes(server: FastifyInstance) {
  const clientController = container.resolve(ClientController);

  server.get('/users/:userId', {
    schema: userViewSchema,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
    handler: clientController.view,
  });

  server.post('/user', {
    schema: userCreatorSchema,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
    handler: clientController.create,
  });

  server.put('/users/:id', {
    schema: userUpdaterSchema,
    handler: clientController.update,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
  });
}
