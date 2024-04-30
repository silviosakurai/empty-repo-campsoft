import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ClientViewerUseCase } from '@core/useCases/client/ClientViewer.useCase';
import { container } from 'tsyringe';

export const viewClient = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const clientViewerUseCase = container.resolve(ClientViewerUseCase);
  const { t, tokenJwtData } = request;

  try {
    const response = await clientViewerUseCase.execute({
      userId: tokenJwtData.clientId,
    });

    if (!response) {
      request.server.logger.warn(response, request.id);

      return sendResponse(reply, {
        message: t('client_not_found'),
        httpStatusCode: HTTPStatusCode.NOT_FOUND,
      });
    }

    return sendResponse(reply, {
      data: response,
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
