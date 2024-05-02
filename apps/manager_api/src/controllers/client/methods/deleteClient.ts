import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { ClientByIdEraserUseCase } from '@core/useCases/client/ClientByIdEraser.useCase';
import { sendResponse } from '@core/common/functions/sendResponse';
import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';

export const deleteClient = async (
  request: FastifyRequest<{
    Params: { userId: string };
  }>,
  reply: FastifyReply
) => {
  const clientEraserUseCase = container.resolve(ClientByIdEraserUseCase);
  const { t, tokenJwtData, permissionsRoute } = request;
  const { redis } = request.server;

  try {
    const response = await clientEraserUseCase.delete(
      tokenJwtData,
      permissionsRoute,
      request.params.userId,
      redis
    );

    if (!response) {
      request.server.logger.warn(response, request.id);

      return sendResponse(reply, {
        message: t('client_not_found'),
        httpStatusCode: HTTPStatusCode.NOT_FOUND,
      });
    }

    return sendResponse(reply, {
      message: t('user_deleted_successfully'),
      httpStatusCode: HTTPStatusCode.OK,
    });
  } catch (error) {
    request.server.logger.error(error, request.id);

    return sendResponse(reply, {
      message: t('internal_server_error'),
      httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
