import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { ClientPasswordUpdaterUseCase } from '@core/useCases/client/ClientPasswordUpdater.useCase';
import { UpdatePasswordClientRequestDto } from '@core/useCases/client/dtos/UpdatePasswordClientRequest.dto';
import { sendResponse } from '@core/common/functions/sendResponse';
import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';

export const updatePasswordClient = async (
  request: FastifyRequest<{
    Body: UpdatePasswordClientRequestDto;
  }>,
  reply: FastifyReply
) => {
  const clientPasswordUpdaterUseCase = container.resolve(
    ClientPasswordUpdaterUseCase
  );
  const { t, tokenKeyData, tokenJwtData, tokenTfaData } = request;

  if (!tokenTfaData.clientId) {
    return sendResponse(reply, {
      message: t('client_not_found'),
      httpStatusCode: HTTPStatusCode.UNAUTHORIZED,
    });
  }

  try {
    const response = await clientPasswordUpdaterUseCase.update(
      tokenJwtData.clientId,
      request.body,
      tokenKeyData,
      tokenTfaData
    );

    if (!response) {
      request.server.logger.warn(response, request.id);

      return sendResponse(reply, {
        message: t('client_not_found'),
        httpStatusCode: HTTPStatusCode.BAD_REQUEST,
      });
    }

    return sendResponse(reply, {
      message: t('user_password_updated_successfully'),
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
