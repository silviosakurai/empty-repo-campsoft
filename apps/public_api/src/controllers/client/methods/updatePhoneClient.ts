import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { ClientPhoneUpdaterUseCase } from '@core/useCases/client/ClientPhoneUpdater.useCase';
import { UpdatePhoneClientRequestDto } from '@core/useCases/client/dtos/UpdatePhoneClientRequest.dto';
import { sendResponse } from '@core/common/functions/sendResponse';
import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';

export const updatePhoneClient = async (
  request: FastifyRequest<{
    Body: UpdatePhoneClientRequestDto;
  }>,
  reply: FastifyReply
) => {
  const clientUseCase = container.resolve(ClientPhoneUpdaterUseCase);
  const { t, tokenKeyData, tokenJwtData } = request;

  try {
    const response = await clientUseCase.update(
      tokenJwtData.clientId,
      request.body,
      tokenKeyData
    );

    if (!response) {
      request.server.logger.warn(response, request.id);

      return sendResponse(reply, {
        message: t('client_not_found'),
        httpStatusCode: HTTPStatusCode.BAD_REQUEST,
      });
    }

    return sendResponse(reply, {
      message: t('user_phone_updated_successfully'),
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
