import { FastifyInstance } from 'fastify';
import { userCreatorSchema } from '@core/validations/user/user.validation';
import { container } from 'tsyringe';
import { UserController } from '@/controllers/user.controller';

export async function userRoutes(server: FastifyInstance) {
  const userController = container.resolve(UserController);

  server.post('/user', {
    preHandler: server.authenticate,
    schema: userCreatorSchema,
    handler: userController.create,
  });
}
