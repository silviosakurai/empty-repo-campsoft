import { HTTPStatusCode } from "@core/common/enums/HTTPStatusCode";
import { sendResponse } from "@core/common/functions/sendResponse";
import { FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { ApiJwtViewerUseCase } from "@core/useCases/api/ApiJwtViewer.useCase";
import { container } from "tsyringe";
import { ViewApiJwtRequest } from "@core/useCases/api/dtos/ViewApiJwtRequest.dto";
import { createCacheKey } from "@core/common/functions/createCacheKey";
import { getRootPath } from "@core/common/functions/getRootPath";

async function authenticateJwt(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const { t, tokenKeyData } = request;
  const { redis } = request.server;

  const routePath = request.routeOptions.url ?? request.raw.url;

  try {
    const apiJwtViewerUseCase = container.resolve(ApiJwtViewerUseCase);
    const decoded: { clientId: string } = await request.jwtVerify();

    if (!decoded || !routePath) {
      return sendResponse(reply, {
        message: t("not_authorized"),
        httpStatusCode: HTTPStatusCode.UNAUTHORIZED,
      });
    }

    const routeModule = getRootPath(routePath, request.module);

    const cacheKey = createCacheKey("jwtCache", decoded.clientId, routeModule);

    const cacheAuth = await redis.get(cacheKey);

    if (cacheAuth) {
      request.tokenJwtData = JSON.parse(cacheAuth);

      return;
    }

    const responseAuth = await apiJwtViewerUseCase.execute({
      clientId: decoded.clientId,
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
