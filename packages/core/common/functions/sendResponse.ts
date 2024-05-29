import { FastifyReply } from "fastify";
import { ResponseService } from "@core/common/interfaces/IResponseServices";
import { HTTPStatusCode } from "@core/common/enums/HTTPStatusCode";

export function sendResponse<T>(
  reply: FastifyReply,
  response: ResponseService<T>
) {
  const httpStatusCode = response.httpStatusCode || HTTPStatusCode.OK;

  const isSuccess =
    typeof response.status === "boolean"
      ? response.status
      : httpStatusCode >= HTTPStatusCode.OK &&
        httpStatusCode < HTTPStatusCode.MULTIPLE_CHOICES;

  const responseBody = {
    status: isSuccess,
    message: response.message || "",
    data: response.data || null,
  };

  reply.code(httpStatusCode).send(responseBody);
}
