import { HTTPStatusCode } from "@core/common/enums/HTTPStatusCode";
import { sendResponse } from "@core/common/functions/sendResponse";
import { FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { ApiJwtViewerUseCase } from "@core/useCases/api/ApiJwtViewer.useCase";
import { container } from "tsyringe";
import { ViewApiJwtRequest } from "@core/useCases/api/dtos/ViewApiJwtRequest.dto";
import { createCacheKey } from "@core/common/functions/createCacheKey";
import { getRootPath } from "@core/common/functions/getRootPath";
import { Permissions } from "@core/common/enums/Permissions";
import { hasRequiredPermission } from "@core/common/functions/hasRequiredPermission";
import { FastifyRedis } from "@fastify/redis";
import { ITokenJwtAccess } from "@core/common/interfaces/ITokenJwtData";

async function handleApiKeyCache(
  redis: FastifyRedis,
  cacheKey: string,
  decoded: { clientId: string },
  routeModule: string
) {
  const cacheAuth = await redis.get(cacheKey);
  if (cacheAuth) {
    return JSON.parse(cacheAuth);
  }

  const apiJwtViewerUseCase = container.resolve(ApiJwtViewerUseCase);
  const responseAuth = await apiJwtViewerUseCase.execute({
    clientId: decoded.clientId,
    routeModule,
  } as ViewApiJwtRequest);

  if (responseAuth) {
    await redis.set(cacheKey, JSON.stringify(responseAuth), "EX", 1800);
  }

  return responseAuth;
}

async function authenticateJwt(
  request: FastifyRequest,
  reply: FastifyReply,
  permissions: Permissions[] | null
): Promise<void> {
  const { t } = request;
  const { redis } = request.server;

  const routePath = request.routeOptions.url ?? request.raw.url;

  try {
    const decoded: { clientId: string } = await request.jwtVerify();

    if (!decoded || !routePath || !permissions) {
      return sendResponse(reply, {
        message: t("not_authorized"),
        httpStatusCode: HTTPStatusCode.UNAUTHORIZED,
      });
    }

    const routeModule = getRootPath(routePath, request.module);
    const cacheKey = createCacheKey("jwtCache", decoded.clientId, routeModule);

    const responseAuth = await handleApiKeyCache(
      redis,
      cacheKey,
      decoded,
      routeModule
    );

    if (!responseAuth) {
      return sendResponse(reply, {
        message: t("not_authorized"),
        httpStatusCode: HTTPStatusCode.UNAUTHORIZED,
      });
    }

    const selectPermissios = responseAuth.access.map(
      (access: ITokenJwtAccess) => access.acao
    );

    const hasPermission = hasRequiredPermission(selectPermissios, permissions);

    if (!hasPermission) {
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
    async (
      request: FastifyRequest,
      reply: FastifyReply,
      permissions: Permissions[] | null = null
    ) => authenticateJwt(request, reply, permissions)
  );
});
