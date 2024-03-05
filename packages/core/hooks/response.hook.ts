import { FastifyRequest, FastifyReply, RequestPayload, HookHandlerDoneFunction } from 'fastify';
import { LoggerService } from '../services/logger.service';

const logger = new LoggerService();

export const responseHook = (request: FastifyRequest, reply: FastifyReply, payload: RequestPayload, done: HookHandlerDoneFunction) => {
  const responseBody = {
    body: payload,
  };

  logger.info({ type: 'RESPONSE', response: responseBody}, request.id);
  done()
};
