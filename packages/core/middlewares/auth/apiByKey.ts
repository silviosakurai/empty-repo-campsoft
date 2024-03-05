import { HTTPStatusCode } from "@core/common/enums/HTTPStatusCode";
import { sendResponse } from "@core/common/functions/sendResponse";
import { ViewApiKeyUseCase } from "@core/useCases/api/ViewApiKey.useCase";
import { ViewApiKeyRequest } from "@core/useCases/api/dtos/ViewApiKeyRequest.dto";
import { FastifyReply, FastifyRequest } from "fastify";
import { container } from "tsyringe";

export const apiByKey = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { t } = request;
  const { redis } = request.server;
  const { keyapi } = request.headers;

  try {
    const viewApiKeyUseCase = container.resolve(ViewApiKeyUseCase);

    const cacheKey = `keyapi:${keyapi}`;
    const cacheAuth = await redis.get(cacheKey);

    if (cacheAuth) {
      request.apiAccess = JSON.parse(cacheAuth);

      return;
    }

    const responseAuth = await viewApiKeyUseCase.execute({
      keyApi: keyapi,
    } as ViewApiKeyRequest);

    if (!responseAuth) {
      return sendResponse(reply, {
        message: t("not_authorized"),
        httpStatusCode: HTTPStatusCode.UNAUTHORIZED,
      });
    }

    await redis.set(cacheKey, JSON.stringify(responseAuth), "EX", 1800);

    request.apiAccess = responseAuth;

    return;
  } catch (error) {
    return sendResponse(reply, {
      message: t("internal_server_error"),
      httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
