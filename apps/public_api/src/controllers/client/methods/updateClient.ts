import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { ClientUpdaterUseCase } from '@core/useCases/client/ClientUpdater.useCase';
import { UpdateClientRequestDto } from '@core/useCases/client/dtos/UpdateClientRequest.dto';
import { sendResponse } from '@core/common/functions/sendResponse';
import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';

export const updateClient = async (
  request: FastifyRequest<{
    Body: UpdateClientRequestDto;
  }>,
  reply: FastifyReply
) => {
  const clientUseCase = container.resolve(ClientUpdaterUseCase);
  const { t, tokenKeyData, tokenJwtData } = request;

  try {
    const response = await clientUseCase.update(
      tokenJwtData.clientId,
      request.body,
      tokenKeyData
    );

    if (!response) {
      return sendResponse(reply, {
        message: t('client_not_found'),
        httpStatusCode: HTTPStatusCode.BAD_REQUEST,
      });
    }

    return sendResponse(reply, {
      message: t('user_updated_successfully'),
      httpStatusCode: HTTPStatusCode.OK,
    });
  } catch (error) {
    return sendResponse(reply, {
      message: t('internal_server_error'),
      httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
