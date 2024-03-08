import TfaController from '@/controllers/tfa';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import { sendCode } from '@core/validations/tfa/tfa.validation';

export default async function authRoutes(server: FastifyInstance) {
  const tfaController = container.resolve(TfaController);

  server.post('/tfa/send-code', {
    schema: sendCode,
    preHandler: server.authenticateKeyApi,
    handler: tfaController.sendCode,
  });
}
