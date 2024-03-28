import {
  FastifyRequest,
  FastifyReply,
  HookHandlerDoneFunction,
  FastifyError,
} from "fastify";
import { LoggerService } from "@core/services/logger.service";
import { container } from "tsyringe";

const logger = container.resolve(LoggerService);

export const errorHook = (
  request: FastifyRequest,
  reply: FastifyReply,
  error: FastifyError,
  done: HookHandlerDoneFunction
) => {
  if (request.raw && request.raw.url && request.raw.url.startsWith("/docs")) {
    return done();
  }

  const responseBody = typeof error === "string" ? JSON.parse(error) : error;
  const { keyapi } = request.headers;

  logger.error({ type: "ERROR", keyapi, response: responseBody }, request.id);

  done();
};
