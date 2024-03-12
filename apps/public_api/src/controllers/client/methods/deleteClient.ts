import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { ClientDeleteUseCase } from '@core/useCases/client/ClientDelete.useCase';
import { sendResponse } from '@core/common/functions/sendResponse';
import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';

export const deleteClient = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const clientDeleteUseCase = container.resolve(ClientDeleteUseCase);
  const { t, tokenKeyData, tokenJwtData, tokenTfaData } = request;

  if (!tokenTfaData.clientId) {
    return sendResponse(reply, {
      message: t('client_not_found'),
      httpStatusCode: HTTPStatusCode.UNAUTHORIZED,
    });
  }

  try {
    const response = await clientDeleteUseCase.delete(
      tokenJwtData,
      tokenKeyData
    );

    if (!response) {
      return sendResponse(reply, {
        message: t('client_not_found'),
        httpStatusCode: HTTPStatusCode.BAD_REQUEST,
      });
    }

    return sendResponse(reply, {
      message: t('user_deleted_successfully'),
      httpStatusCode: HTTPStatusCode.OK,
    });
  } catch (error) {
    return sendResponse(reply, {
      message: t('internal_server_error'),
      httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
