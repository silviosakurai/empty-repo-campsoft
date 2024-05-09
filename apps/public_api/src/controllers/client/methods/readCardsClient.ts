import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { ClientCardReaderUseCase } from '@core/useCases/client/ClientCardReader.useCase';
import { sendResponse } from '@core/common/functions/sendResponse';
import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';

export const readCardsClient = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const service = container.resolve(ClientCardReaderUseCase);
  const { t, tokenJwtData } = request;

  try {
    const data = await service.read(tokenJwtData.clientId);

    return sendResponse(reply, {
      httpStatusCode: HTTPStatusCode.OK,
      data,
    });
  } catch (error) {
    request.server.logger.error(error, request.id);

    return sendResponse(reply, {
      message: t('internal_server_error'),
      httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
