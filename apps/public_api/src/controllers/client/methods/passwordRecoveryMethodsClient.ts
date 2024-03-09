import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ClientPasswordRecoveryMethodsUseCase } from '@core/useCases/client/ClientPasswordRecoveryMethods.useCase';
import { container } from 'tsyringe';

export const passwordRecoveryMethodsClient = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const clientPasswordRecoveryMethodsUseCase = container.resolve(
    ClientPasswordRecoveryMethodsUseCase
  );
  const { t, apiAccess } = request;
  const { login } = request.params as { login: string };

  const response = await clientPasswordRecoveryMethodsUseCase.execute({
    apiAccess,
    login,
  });

  try {
    if (!response) {
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
    return sendResponse(reply, {
      message: t('internal_server_error'),
      httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
