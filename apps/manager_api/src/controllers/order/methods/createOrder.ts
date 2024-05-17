import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateOrderByManagerUseCase } from '@core/useCases/order/CreateOrderByManager.useCase';
import { CreateOrderByManagerRequestDto } from '@core/useCases/order/dtos/CreateOrderByManagerRequest.dto';
import { container } from 'tsyringe';
import CreditCardExpirationDateIsInvalidError from '@core/common/exceptions/CreditCardExpirationDateIsInvalidError';
import { generalEnvironment } from '@core/config/environments';

export const createOrder = async (
  request: FastifyRequest<{
    Body: CreateOrderByManagerRequestDto;
  }>,
  reply: FastifyReply
) => {
  const createOrderUseCase = container.resolve(CreateOrderByManagerUseCase);
  const { t, tokenKeyData, tokenJwtData } = request;

  const clientIdBody = {
    clientId: request.body.client_id,
    access: [],
  }

  try {
    const splitRuleId = generalEnvironment;

    const response = await createOrderUseCase.execute(
      t,
      tokenJwtData.clientId,
      tokenKeyData,
      clientIdBody,
      request.body,
      splitRuleId.managerSplitRuleId,
    );

    return sendResponse(reply, {
      data: response,
      httpStatusCode: HTTPStatusCode.OK,
    });
  } catch (error) {
    request.server.logger.error(error, request.id);

    if (error instanceof CreditCardExpirationDateIsInvalidError) {
      return sendResponse(reply, {
        message: t('expired_card_error'),
        httpStatusCode: HTTPStatusCode.BAD_REQUEST,
      });
    }

    if (error instanceof Error) {
      return sendResponse(reply, {
        message: error.message,
        httpStatusCode: HTTPStatusCode.BAD_REQUEST,
      });
    }

    return sendResponse(reply, {
      message: t('internal_server_error'),
      httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
