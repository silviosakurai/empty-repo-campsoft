import { HTTPStatusCode } from "@core/common/enums/HTTPStatusCode";
import { sendResponse } from "@core/common/functions/sendResponse";
import { ViewApiJwtUseCase } from "@core/useCases/api/ViewApiJwt.useCase";
import { ViewApiJwtRequest } from "@core/useCases/api/dtos/ViewApiJwtRequest.dto";
import { FastifyReply, FastifyRequest } from "fastify";
import { container } from "tsyringe";

export const apiByJwt = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { t } = request;
  const { redis } = request.server;

  try {
    const viewApiJwtUseCase = container.resolve(ViewApiJwtUseCase);
    const decoded = (await request.jwtVerify()) as ViewApiJwtRequest;

    if (!decoded) {
      return sendResponse(reply, {
        message: t("not_authorized"),
        httpStatusCode: HTTPStatusCode.UNAUTHORIZED,
      });
    }

    const cacheKey = `jwt:${decoded.clientId}`;
    const cacheAuth = await redis.get(cacheKey);

    if (cacheAuth) {
      request.apiAccess = JSON.parse(cacheAuth);

      return;
    }

    const responseAuth = await viewApiJwtUseCase.execute(decoded);

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
      message: t("not_authorized"),
      httpStatusCode: HTTPStatusCode.UNAUTHORIZED,
    });
  }
};
