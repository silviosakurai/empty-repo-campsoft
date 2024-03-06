import { HTTPStatusCode } from "@core/common/enums/HTTPStatusCode";
import { sendResponse } from "@core/common/functions/sendResponse";
import { FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { apiByJwt } from "@core/middlewares/auth/apiByJwt";
import { apiByKey } from "@core/middlewares/auth/apiByKey";

async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const { authorization, keyapi } = request.headers;
  const { t } = request;

  if (!keyapi) {
    return sendResponse(reply, {
      message: t("not_authorized"),
      httpStatusCode: HTTPStatusCode.UNAUTHORIZED,
    });
  }

  await apiByKey(request, reply);

  if (!authorization) {
    return sendResponse(reply, {
      message: t("not_authorized"),
      httpStatusCode: HTTPStatusCode.UNAUTHORIZED,
    });
  }

  await apiByJwt(request, reply);

  return;
}

export default fp(async (fastify) => {
  fastify.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) =>
      authenticate(request, reply)
  );
});
