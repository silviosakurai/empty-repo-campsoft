import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { ClientByIdViewerUseCase } from '@core/useCases/client/ClientByIdViewer.useCase';

export const viewClient = async (
  request: FastifyRequest<{
    Params: { userId: string };
  }>,
  reply: FastifyReply
) => {
  const clientViewerUseCase = container.resolve(ClientByIdViewerUseCase);
  const { t, tokenKeyData, tokenJwtData } = request;

  try {
    const response = await clientViewerUseCase.execute({
      tokenKeyData,
      userId: request.params.userId,
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
