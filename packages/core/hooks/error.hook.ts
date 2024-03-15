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
  const responseBody = typeof error === "string" ? JSON.parse(error) : error;
  const { keyapi } = request.headers;

  console.log("errorHook", responseBody);

  logger.error({ type: "ERROR", keyapi, response: responseBody }, request.id);

  done();
};
