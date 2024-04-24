import TfaController from '@/controllers/tfa';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import { sendCodeSchema, validateCodeSchema } from '@core/validations/tfa';
import {
  tfaSendCodePermissions,
  tfaValidateCodePermissions,
} from '@/permissions';

export default async function authRoutes(server: FastifyInstance) {
  const tfaController = container.resolve(TfaController);

  server.post('/tfa/send-code', {
    schema: sendCodeSchema,
    handler: tfaController.sendCode,
    preHandler: [
      (request, reply) =>
        server.authenticateKeyApi(request, reply, tfaSendCodePermissions),
    ],
  });

  server.post('/tfa/validate-code', {
    schema: validateCodeSchema,
    handler: tfaController.validateCode,
    preHandler: [
      (request, reply) =>
        server.authenticateKeyApi(request, reply, tfaValidateCodePermissions),
    ],
  });
}
