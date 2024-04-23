import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { ClientSendSsoUseCase } from '@core/useCases/client/ClientSendSsoUseCase.useCase';
import { sendResponse } from '@core/common/functions/sendResponse';
import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';

export const sendSsoClient = async (
  request: FastifyRequest<{
    Params: { userId: string };
  }>,
  reply: FastifyReply
) => {
  const clientSendSSoUseCase = container.resolve(ClientSendSsoUseCase);
  const { t } = request;

  try {
    const response = await clientSendSSoUseCase.send(request.params.userId);

    if (!response) {
      request.server.logger.warn(response, request.id);

      return sendResponse(reply, {
        message: t('client_not_found'),
        httpStatusCode: HTTPStatusCode.NOT_FOUND,
      });
    }

    return sendResponse(reply, {
      message: t('token_generated_successfuly'),
      httpStatusCode: HTTPStatusCode.OK,
      data: response,
    });
  } catch (error) {
    request.server.logger.error(error, request.id);

    return sendResponse(reply, {
      message: t('internal_server_error'),
      httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
