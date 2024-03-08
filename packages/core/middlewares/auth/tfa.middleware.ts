import { HTTPStatusCode } from "@core/common/enums/HTTPStatusCode";
import { sendResponse } from "@core/common/functions/sendResponse";
import { FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { ViewApiTfaUseCase } from "@core/useCases/api/ViewApiTfa.useCase";
import { container } from "tsyringe";
import { ViewApiTfaRequest } from "@core/useCases/api/dtos/ViewApiTfaRequest.dto";

async function authenticateTfa(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const { t } = request;
  const { redis } = request.server;
  const { tokentfa } = request.headers as { tokentfa: string };

  if (!tokentfa) {
    return sendResponse(reply, {
      message: t("not_authorized"),
      httpStatusCode: HTTPStatusCode.UNAUTHORIZED,
    });
  }

  try {
    const decoded = (await request.server.decodeToken(tokentfa)) as {
      token: string;
    };

    if (!decoded) {
      return sendResponse(reply, {
        message: t("not_authorized"),
        httpStatusCode: HTTPStatusCode.UNAUTHORIZED,
      });
    }

    const cacheKey = `tfa:${decoded.token}`;
    const cacheAuth = await redis.get(cacheKey);

    if (cacheAuth) {
      request.tfaInfo = JSON.parse(cacheAuth);

      return;
    }

    const viewApiTfaUseCase = container.resolve(ViewApiTfaUseCase);

    const responseAuth = await viewApiTfaUseCase.execute({
      token: decoded.token,
    } as ViewApiTfaRequest);

    if (!responseAuth) {
      return sendResponse(reply, {
        message: t("not_authorized"),
        httpStatusCode: HTTPStatusCode.UNAUTHORIZED,
      });
    }

    await redis.set(cacheKey, JSON.stringify(responseAuth), "EX", 1800);

    request.tfaInfo = responseAuth;

    return;
  } catch (error) {
    return sendResponse(reply, {
      message: t("not_authorized"),
      httpStatusCode: HTTPStatusCode.UNAUTHORIZED,
    });
  }
}

export default fp(async (fastify) => {
  fastify.decorate(
    "authenticateTfa",
    async (request: FastifyRequest, reply: FastifyReply) =>
      authenticateTfa(request, reply)
  );
});