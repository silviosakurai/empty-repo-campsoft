import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { ClientEmailActivatorUseCase } from '@core/useCases/client/ClientEmailActivator.useCase';
import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';

export const activateClientEmail = async (
  request: FastifyRequest<{ Params: { token: string } }>,
  reply: FastifyReply
) => {
  const service = container.resolve(ClientEmailActivatorUseCase);
  const { t, tokenJwtData } = request;

  try {
    const result = await service.execute(
      tokenJwtData.clientId,
      request.params.token
    );

    if (!result) {
      return sendResponse(reply, {
        message: t('token_not_found'),
        httpStatusCode: HTTPStatusCode.NOT_FOUND,
      });
    }

    return sendResponse(reply, {
      httpStatusCode: HTTPStatusCode.OK,
    });
  } catch (error) {
    console.log(error);

    request.server.logger.error(error, request.id);

    return sendResponse(reply, {
      message: t('internal_server_error'),
      httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
