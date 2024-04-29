import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { ClientCreditCardDefaultUpdaterUseCase } from '@core/useCases/client/ClientCreditCardDefaultUpdater.useCase';
import { sendResponse } from '@core/common/functions/sendResponse';
import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';

export const updateUserCreditCardDefault = async (
  request: FastifyRequest<{
    Params: { id: string };
    Body: { default: boolean };
  }>,
  reply: FastifyReply
) => {
  const service = container.resolve(ClientCreditCardDefaultUpdaterUseCase);
  const { t, params, tokenJwtData, body } = request;

  try {
    const result = await service.update(t, {
      cardId: params.id,
      clientId: tokenJwtData.clientId,
      default: body.default,
    });

    if (!result) {
      return sendResponse(reply, {
        message: t('internal_server_error'),
        httpStatusCode: HTTPStatusCode.BAD_REQUEST,
      });
    }

    return sendResponse(reply, {
      httpStatusCode: HTTPStatusCode.OK,
    });
  } catch (error) {
    request.server.logger.error(error, request.id);

    if (error instanceof Error) {
      return sendResponse(reply, {
        message: error.message,
        httpStatusCode: HTTPStatusCode.BAD_REQUEST,
      });
    }

    return sendResponse(reply, {
      message: t('internal_server_error'),
      httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
