import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';
import { LoggerService } from '../services/logger.service';

const logger = new LoggerService();

export const requestHook = (request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) => {
  const allParams = {
    params: request.params,
    query: request.query,
    body: request.body
  };

  logger.info({ type: 'REQUEST', request: allParams});
  done()
};
