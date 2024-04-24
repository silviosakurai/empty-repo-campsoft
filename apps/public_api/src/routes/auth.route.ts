import AuthController from '@/controllers/auth';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import { loginSchema, loginTokenSchema } from '@core/validations/auth';
import { authLoginPermissions, authTokenPermissions } from '@/permissions';

export default async function authRoutes(server: FastifyInstance) {
  const authController = container.resolve(AuthController);

  server.post('/authentication/login', {
    schema: loginSchema,
    handler: authController.login,
    preHandler: [
      (request, reply) =>
        server.authenticateKeyApi(request, reply, authLoginPermissions),
    ],
  });

  server.post('/authentication/token', {
    schema: loginTokenSchema,
    handler: authController.token,
    preHandler: [
      (request, reply) =>
        server.authenticateKeyApi(request, reply, authTokenPermissions),
    ],
  });
}
