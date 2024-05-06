import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { ClientCardEraserUseCase } from '@core/useCases/client/ClientCardEraser.useCase';
import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';

export const eraseCardClient = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const service = container.resolve(ClientCardEraserUseCase);
  const { t, tokenJwtData, params } = request;

  try {
    const result = await service.erase(tokenJwtData.clientId, params.id, t);

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
        httpStatusCode:
          error.message === t('card_not_found')
            ? HTTPStatusCode.NOT_FOUND
            : HTTPStatusCode.BAD_REQUEST,
      });
    }

    return sendResponse(reply, {
      message: t('internal_server_error'),
      httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
