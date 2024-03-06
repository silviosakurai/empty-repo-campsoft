import ClientController from '@/controllers/client';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import {
  userCreatorSchema,
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
    preHandler: server.authenticate,
    handler: clientController.create,
  });
}
