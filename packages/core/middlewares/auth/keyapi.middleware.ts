import { HTTPStatusCode } from "@core/common/enums/HTTPStatusCode";
import { createCacheKey } from "@core/common/functions/createCacheKey";
import { getRootPath } from "@core/common/functions/getRootPath";
import { sendResponse } from "@core/common/functions/sendResponse";
import { ApiKeyViewerUseCase } from "@core/useCases/api/ApiKeyViewer.useCase";
import { ViewApiKeyRequest } from "@core/useCases/api/dtos/ViewApiKeyRequest.dto";
import { FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { container } from "tsyringe";

async function authenticateKeyApi(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const { t } = request;
  const { redis } = request.server;
  const { keyapi } = request.headers;

  const routePath = request.routeOptions.url ?? request.raw.url;

  if (!keyapi || !routePath) {
    return sendResponse(reply, {
      message: t("not_authorized"),
      httpStatusCode: HTTPStatusCode.UNAUTHORIZED,
    });
  }

  const routeModule = getRootPath(routePath, request.module);

  console.log("routePath", routeModule);

  const apiKeyViewerUseCase = container.resolve(ApiKeyViewerUseCase);

  const cacheKey = createCacheKey("keyCache", keyapi, routeModule);

  const cacheAuth = await redis.get(cacheKey);

  if (cacheAuth) {
    request.tokenKeyData = JSON.parse(cacheAuth);

    //  return;
  }

  const responseAuth = await apiKeyViewerUseCase.execute({
    keyApi: keyapi,
    routeModule,
  } as ViewApiKeyRequest);

  console.log("responseAuth", responseAuth);

  try {
    // if (!responseAuth) {
    return sendResponse(reply, {
      message: t("not_authorized"),
      httpStatusCode: HTTPStatusCode.UNAUTHORIZED,
    });
    // }

    await redis.set(cacheKey, JSON.stringify(responseAuth), "EX", 1800);

    //request.tokenKeyData = responseAuth;

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
    async (request: FastifyRequest, reply: FastifyReply) =>
      authenticateKeyApi(request, reply)
  );
});
