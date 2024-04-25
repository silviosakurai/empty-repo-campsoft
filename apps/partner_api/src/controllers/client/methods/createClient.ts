import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { ClientCreatorPartnerUseCase } from '@core/useCases/client/ClientCreatorPartner.useCase';
import { CreateClientRequestPartnerDto } from '@core/useCases/client/dtos/CreateClientRequestPartner.dto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';

export async function createClient(
  request: FastifyRequest<{ Body: CreateClientRequestPartnerDto }>,
  reply: FastifyReply
) {
  try {
    const clientUseCase = container.resolve(ClientCreatorPartnerUseCase);

    const response = await clientUseCase.create([], request.body);

    if (!response) {
      request.server.logger.warn(response, request.id);

      throw new Error(request.t('previously_registered_user'));
    }

    return sendResponse(reply, {
      data: response,
      httpStatusCode: HTTPStatusCode.CREATED,
    });
  } catch (error) {
    request.server.logger.error(error, request.id);

    const message =
      error instanceof Error
        ? error.message
        : request.t('internal_server_error');

    return sendResponse(reply, {
      message: message,
      httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
}
