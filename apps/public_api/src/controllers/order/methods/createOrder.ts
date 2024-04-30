import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateOrderUseCase } from '@core/useCases/order/CreateOrder.useCase';
import { CreateOrderRequestDto } from '@core/useCases/order/dtos/CreateOrderRequest.dto';
import { container } from 'tsyringe';
import CreditCardExpirationDateIsInvalidError from '@core/common/exceptions/CreditCardExpirationDateIsInvalidError';

export const createOrder = async (
  request: FastifyRequest<{
    Body: CreateOrderRequestDto;
  }>,
  reply: FastifyReply
) => {
  const createOrderUseCase = container.resolve(CreateOrderUseCase);
  const { t, tokenKeyData, tokenJwtData } = request;

  try {
    const response = await createOrderUseCase.execute(
      t,
      tokenKeyData,
      tokenJwtData,
      request.body
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
      if (
        error.message === 'invalid_card_number' ||
        error.message === 'expired_card_error' ||
        error.message === 'service_request_timeout' ||
        error.message === 'something_went_wrong_to_generate_credit_card'
      ) {
        return sendResponse(reply, {
          message: t(error.message),
          httpStatusCode: HTTPStatusCode.BAD_REQUEST,
        });
      }

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
