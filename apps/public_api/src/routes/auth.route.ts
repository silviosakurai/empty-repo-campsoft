import AuthController from '@/controllers/auth';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import {
  loginSchema,
  loginTokenSchema,
} from '@core/validations/auth/auth.validation';

export default async function authRoutes(server: FastifyInstance) {
  const authController = container.resolve(AuthController);

  server.post('/authentication/login', {
    schema: loginSchema,
    preHandler: server.authenticateKeyApi,
    handler: authController.login,
  });

  server.post('/authentication/token', {
    schema: loginTokenSchema,
    preHandler: server.authenticateKeyApi,
    handler: authController.token,
  });
}
