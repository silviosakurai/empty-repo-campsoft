import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { ClientPasswordRecoveryUpdaterUseCase } from '@core/useCases/client/ClientPasswordRecoveryUpdater.useCase';
import { sendResponse } from '@core/common/functions/sendResponse';
import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { UpdatePasswordRecoveryClientRequestDto } from '@core/useCases/client/dtos/UpdatePasswordRecoveryClientRequest.dto';

export const updatePasswordRecoveryClient = async (
  request: FastifyRequest<{
    Body: UpdatePasswordRecoveryClientRequestDto;
    Params: {
      new_password: string;
    };
  }>,
  reply: FastifyReply
) => {
  const clientPasswordRecoveryUpdaterUseCase = container.resolve(
    ClientPasswordRecoveryUpdaterUseCase
  );
  const { t, tokenKeyData, tokenTfaData } = request;

  if (!tokenTfaData.clientId) {
    request.server.logger.warn(tokenTfaData, request.id);

    return sendResponse(reply, {
      message: t('client_not_found'),
      httpStatusCode: HTTPStatusCode.NOT_FOUND,
    });
  }

  try {
    const response = await clientPasswordRecoveryUpdaterUseCase.update(
      tokenTfaData,
      tokenKeyData,
      request.body
    );

    if (!response) {
      request.server.logger.warn(response, request.id);

      return sendResponse(reply, {
        message: t('client_not_found'),
        httpStatusCode: HTTPStatusCode.NOT_FOUND,
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
