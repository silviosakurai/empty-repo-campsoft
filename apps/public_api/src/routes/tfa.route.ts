import TfaController from '@/controllers/tfa';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import { sendCodeSchema, validateCodeSchema } from '@core/validations/tfa';

export default async function authRoutes(server: FastifyInstance) {
  const tfaController = container.resolve(TfaController);

  server.post('/tfa/send-code', {
    schema: sendCodeSchema,
    preHandler: [server.authenticateKeyApi],
    handler: tfaController.sendCode,
  });

  server.post('/tfa/validate-code', {
    schema: validateCodeSchema,
    preHandler: [server.authenticateKeyApi],
    handler: tfaController.validateCode,
  });
}
