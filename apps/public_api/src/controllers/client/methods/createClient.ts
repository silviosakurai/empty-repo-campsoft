import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { ClientCreatorUseCase } from '@core/useCases/client/ClientCreator.useCase';
import { CreateClientRequestDto } from '@core/useCases/client/dtos/CreateClientRequest.dto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';

async function validateClientCreation(
  request: FastifyRequest<{ Body: CreateClientRequestDto }>
) {
  const clientUseCase = container.resolve(ClientCreatorUseCase);
  const { t, tokenTfaData } = request;
  const validateType = clientUseCase.validateTypeTfa(
    tokenTfaData,
    request.body
  );

  if (!validateType) {
    request.server.logger.warn(validateType, request.id);

    throw new Error(t('phone_not_match_token'));
  }
}

async function createClientHandler(
  request: FastifyRequest<{ Body: CreateClientRequestDto }>,
  reply: FastifyReply
) {
  try {
    await validateClientCreation(request);

    const clientUseCase = container.resolve(ClientCreatorUseCase);
    const { tokenKeyData } = request;
    const response = await clientUseCase.create(tokenKeyData, request.body);

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

export const createClient = async (
  request: FastifyRequest<{ Body: CreateClientRequestDto }>,
  reply: FastifyReply
) => {
  return createClientHandler(request, reply);
};
