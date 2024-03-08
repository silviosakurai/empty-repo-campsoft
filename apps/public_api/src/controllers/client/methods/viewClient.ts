import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { ViewClientRequest } from '@core/useCases/client/dtos/ViewClientRequest.dto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ViewClientUseCase } from '@core/useCases/client/ViewClient.useCase';
import { container } from 'tsyringe';

export const viewClient = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const viewClientUseCase = container.resolve(ViewClientUseCase);
  const { t, apiAccess } = request;
  const { userId } = request.params as ViewClientRequest;

  try {
    const response = await viewClientUseCase.execute({
      apiAccess,
      userId,
    });

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