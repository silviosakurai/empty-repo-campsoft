import {
  FastifyRequest,
  FastifyReply,
  RequestPayload,
  HookHandlerDoneFunction,
} from "fastify";
import { LoggerService } from "@core/services/logger.service";
import { container } from "tsyringe";

const logger = container.resolve(LoggerService);

export const responseHook = (
  request: FastifyRequest,
  reply: FastifyReply,
  payload: RequestPayload,
  done: HookHandlerDoneFunction
) => {
  if (request.raw?.url?.startsWith("/docs")) {
    return done();
  }

  const responseBody =
    typeof payload === "string" ? JSON.parse(payload) : payload;

  const { keyapi } = request.headers;

  logger.info({ type: "RESPONSE", keyapi, response: responseBody }, request.id);

  done();
};
