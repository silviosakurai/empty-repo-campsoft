import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { CreateClientUseCase } from '@core/useCases/client/CreateClient.useCase';
import { CreateClientRequestDto } from '@core/useCases/client/dtos/CreateClientRequest.dto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';

export const createClient = async (
  request: FastifyRequest<{ Body: CreateClientRequestDto }>,
  reply: FastifyReply
) => {
  const clientUseCase = container.resolve(CreateClientUseCase);
  const { t, apiAccess } = request;

  try {
    const response = await clientUseCase.execute(
      apiAccess.company_id,
      request.body
    );

    if (!response) {
      return sendResponse(reply, {
        data: response,
        message: t('previously_registered_user'),
        httpStatusCode: HTTPStatusCode.CONFLICT,
      });
    }

    return sendResponse(reply, {
      data: response,
      httpStatusCode: HTTPStatusCode.CREATED,
    });
  } catch (error) {
    console.log(error);
    return sendResponse(reply, {
      message: t('internal_server_error'),
      httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
