import ClientController from '@/controllers/client.controller';
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
    preHandler: server.authenticate,
    handler: clientController.viewClient,
  });

  server.post('/user', {
    schema: userCreatorSchema,
    preHandler: server.authenticate,
    handler: clientController.create,
  });
}
