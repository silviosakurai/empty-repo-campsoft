import { HTTPStatusCode } from "@core/common/enums/HTTPStatusCode";
import { sendResponse } from "@core/common/functions/sendResponse";
import { FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { ViewApiJwtUseCase } from "@core/useCases/api/ViewApiJwt.useCase";
import { container } from "tsyringe";
import { ViewApiJwtRequest } from "@core/useCases/api/dtos/ViewApiJwtRequest.dto";

async function authenticateJwt(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const { t, tokenKeyData } = request;
  const { redis } = request.server;

  const routePath = request.routeOptions.url || request.raw.url;
  const routeMethod = request.routeOptions.method;
  const routeModule = request.module;

  try {
    const viewApiJwtUseCase = container.resolve(ViewApiJwtUseCase);
    const decoded = (await request.jwtVerify()) as { clientId: string };

    if (!decoded) {
      return sendResponse(reply, {
        message: t("not_authorized"),
        httpStatusCode: HTTPStatusCode.UNAUTHORIZED,
      });
    }

    const cacheKey = `jwt:${decoded.clientId}`;
    const cacheAuth = await redis.get(cacheKey);

    if (cacheAuth) {
      request.tokenJwtData = JSON.parse(cacheAuth);

      return;
    }

    const responseAuth = await viewApiJwtUseCase.execute({
      clientId: decoded.clientId,
      tokenKeyData,
      routePath,
      routeMethod,
      routeModule,
    } as ViewApiJwtRequest);

    if (!responseAuth) {
      return sendResponse(reply, {
        message: t("not_authorized"),
        httpStatusCode: HTTPStatusCode.UNAUTHORIZED,
      });
    }

    await redis.set(cacheKey, JSON.stringify(responseAuth), "EX", 1800);

    request.tokenJwtData = responseAuth;

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
    "authenticateJwt",
    async (request: FastifyRequest, reply: FastifyReply) =>
      authenticateJwt(request, reply)
  );
});
