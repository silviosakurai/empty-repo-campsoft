import { HTTPStatusCode } from "@core/common/enums/HTTPStatusCode";
import { createCacheKey } from "@core/common/functions/createCacheKey";
import { getRootPath } from "@core/common/functions/getRootPath";
import { sendResponse } from "@core/common/functions/sendResponse";
import { ApiKeyViewerUseCase } from "@core/useCases/api/ApiKeyViewer.useCase";
import { ViewApiKeyRequest } from "@core/useCases/api/dtos/ViewApiKeyRequest.dto";
import { FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { container } from "tsyringe";
import { PermissionsRoles } from "@core/common/enums/PermissionsRoles";
import { hasRequiredPermission } from "@core/common/functions/hasRequiredPermission";
import { FastifyRedis } from "@fastify/redis";

async function handleApiKeyCache(
  redis: FastifyRedis,
  cacheKey: string,
  keyapi: string | string[] | undefined,
  routeModule: string
) {
  const cacheAuth = await redis.get(cacheKey);
  if (cacheAuth) {
    return JSON.parse(cacheAuth);
  }

  const apiKeyViewerUseCase = container.resolve(ApiKeyViewerUseCase);
  const responseAuth = await apiKeyViewerUseCase.execute({
    keyApi: keyapi,
    routeModule,
  } as ViewApiKeyRequest);

  if (responseAuth) {
    await redis.set(cacheKey, JSON.stringify(responseAuth), "EX", 1800);
  }

  return responseAuth;
}

async function authenticateKeyApi(
  request: FastifyRequest,
  reply: FastifyReply,
  permissions: PermissionsRoles[] | null
): Promise<void> {
  const { t } = request;
  const { redis } = request.server;
  const { keyapi } = request.headers;
  const routePath = request.routeOptions.url ?? request.raw.url;

  if (!keyapi || !routePath || !permissions) {
    return sendResponse(reply, {
      message: t("not_authorized"),
      httpStatusCode: HTTPStatusCode.UNAUTHORIZED,
    });
  }

  try {
    const routeModule = getRootPath(routePath, request.module);
    const cacheKey = createCacheKey("keyCache", keyapi, routeModule);
    const responseAuth = await handleApiKeyCache(
      redis,
      cacheKey,
      keyapi,
      routeModule
    );

    if (!responseAuth) {
      return sendResponse(reply, {
        message: t("not_authorized"),
        httpStatusCode: HTTPStatusCode.UNAUTHORIZED,
      });
    }

    const hasPermission = hasRequiredPermission(
      responseAuth.acoes,
      permissions
    );

    if (!hasPermission) {
      return sendResponse(reply, {
        message: t("not_authorized"),
        httpStatusCode: HTTPStatusCode.UNAUTHORIZED,
      });
    }

    request.tokenKeyData = responseAuth;

    return;
  } catch (error) {
    return sendResponse(reply, {
      message: t("not_authorized"),
      httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
}

export default fp(async (fastify) => {
  fastify.decorate(
    "authenticateKeyApi",
    async (
      request: FastifyRequest,
      reply: FastifyReply,
      permissions: PermissionsRoles[] | null = null
    ) => authenticateKeyApi(request, reply, permissions)
  );
});
