import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { ICreateCreditCardTokenRequest } from '@core/interfaces/services/payment/ICreateCreditCardToken';
import { ClientCardCreatorUseCase } from '@core/useCases/client/ClientCardCreator.useCase';
import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';

export const createCardClient = async (
  request: FastifyRequest<{ Body: ICreateCreditCardTokenRequest }>,
  reply: FastifyReply
) => {
  const service = container.resolve(ClientCardCreatorUseCase);
  const { t, tokenJwtData, body } = request;

  try {
    const result = await service.create(tokenJwtData.clientId, t, body);

    if (!result) {
      return sendResponse(reply, {
        message: t('something_went_wrong_to_generate_credit_card'),
        httpStatusCode: HTTPStatusCode.BAD_REQUEST,
      });
    }

    return sendResponse(reply, {
      httpStatusCode: HTTPStatusCode.CREATED,
      data: {
        card_id: result.id,
      },
    });
  } catch (error) {
    request.server.logger.error(error, request.id);

    return sendResponse(reply, {
      message: t('internal_server_error'),
      httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
