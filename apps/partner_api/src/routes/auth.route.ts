import AuthController from '@/controllers/auth';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import { loginSchema } from '@core/validations/auth';

export default async function authRoutes(server: FastifyInstance) {
  const authController = container.resolve(AuthController);

  server.post('/authentication/login', {
    schema: loginSchema,
    handler: authController.login,
  });
}
