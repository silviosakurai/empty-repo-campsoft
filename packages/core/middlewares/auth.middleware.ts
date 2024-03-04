import { HTTPStatusCode } from "@core/common/enums/HTTPStatusCode";
import { sendResponse } from "@core/common/functions/sendResponse";
import { FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";

async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const { authorization } = request.headers;
  const { t } = request;

  if (authorization) {
    sendResponse(reply, {
      message: t("not_authorized"),
      httpStatusCode: HTTPStatusCode.UNAUTHORIZED,
    });
  }
}

export default fp(async (fastify) => {
  fastify.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) =>
      authenticate(request, reply)
  );
});
