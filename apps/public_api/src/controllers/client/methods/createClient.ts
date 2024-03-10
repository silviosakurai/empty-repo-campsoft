import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { ClientCreatorUseCase } from '@core/useCases/client/ClientCreator.useCase';
import { CreateClientRequestDto } from '@core/useCases/client/dtos/CreateClientRequest.dto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';

export const createClient = async (
  request: FastifyRequest<{ Body: CreateClientRequestDto }>,
  reply: FastifyReply
) => {
  const clientUseCase = container.resolve(ClientCreatorUseCase);
  const { t, tokenKeyData, tokenTfaData } = request;

  try {
    const validateType = clientUseCase.validateTypeTfa(
      tokenTfaData,
      request.body
    );

    if (!validateType) {
      return sendResponse(reply, {
        message: t('phone_not_match_token'),
        httpStatusCode: HTTPStatusCode.FORBIDDEN,
      });
    }

    const response = await clientUseCase.create(
      tokenKeyData.company_id,
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
    return sendResponse(reply, {
      message: t('internal_server_error'),
      httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
