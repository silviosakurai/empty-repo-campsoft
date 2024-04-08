import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from "fastify";
import { LoggerService } from "@core/services/logger.service";
import { container } from "tsyringe";

const logger = container.resolve(LoggerService);

export const requestHook = (
  request: FastifyRequest,
  reply: FastifyReply,
  done: HookHandlerDoneFunction
) => {
  if (request.raw?.url?.startsWith("/docs")) {
    return done();
  }

  const allParams = {
    params: request.params,
    query: request.query,
    body: request.body,
  };

  const { keyapi } = request.headers;

  logger.info({ type: "REQUEST", keyapi, request: allParams }, request.id);

  done();
};
