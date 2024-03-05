import { HTTPStatusCode } from "@core/common/enums/HTTPStatusCode";
import { sendResponse } from "@core/common/functions/sendResponse";
import { ViewApiUseCase } from "@core/useCases/api/ViewApi.useCase";
import { ViewApiRequest } from "@core/useCases/api/dtos/ViewApiRequest.dto";
import { FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { container } from "tsyringe";

async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const { authorization, keyapi } = request.headers;
  const { t } = request;

  if (authorization) {
    try {
      await request.jwtVerify();

      return;
    } catch (error) {
      return sendResponse(reply, {
        message: t("not_authorized"),
        httpStatusCode: HTTPStatusCode.UNAUTHORIZED,
      });
    }
  }

  if (keyapi) {
    const viewApiUseCase = container.resolve(ViewApiUseCase);

    try {
      const responseAuth = await viewApiUseCase.execute({
        keyApi: keyapi,
      } as ViewApiRequest);

      if (!responseAuth) {
        return sendResponse(reply, {
          message: t("not_authorized"),
          httpStatusCode: HTTPStatusCode.UNAUTHORIZED,
        });
      }

      return;
    } catch (error) {
      return sendResponse(reply, {
        message: t("internal_server_error"),
        httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
      });
    }
  }

  return sendResponse(reply, {
    message: t("not_authorized"),
    httpStatusCode: HTTPStatusCode.UNAUTHORIZED,
  });
}

export default fp(async (fastify) => {
  fastify.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) =>
      authenticate(request, reply)
  );
});
