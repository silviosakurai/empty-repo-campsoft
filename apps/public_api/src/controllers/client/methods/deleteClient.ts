import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { ClientEraserUseCase } from '@core/useCases/client/ClientEraser.useCase';
import { sendResponse } from '@core/common/functions/sendResponse';
import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';

export const deleteClient = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const clientEraserUseCase = container.resolve(ClientEraserUseCase);
  const { t, tokenKeyData, tokenJwtData, tokenTfaData } = request;

  if (!tokenTfaData.clientId) {
    request.server.logger.warn(tokenTfaData, request.id);

    return sendResponse(reply, {
      message: t('client_not_found'),
      httpStatusCode: HTTPStatusCode.NOT_FOUND,
    });
  }

  try {
    const response = await clientEraserUseCase.delete(
      tokenJwtData,
      tokenKeyData
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
