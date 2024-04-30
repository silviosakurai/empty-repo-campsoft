import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { PayerCreditCardByOrderIdUseCase } from '@core/useCases/order/PayerCreditCardByOrderId.useCase';
import { PayByCreditCardRequest } from '@core/useCases/order/dtos/PayByCreditCardRequest.dto';
import CreditCardExpirationDateIsInvalidError from '@core/common/exceptions/CreditCardExpirationDateIsInvalidError';

export const paymentByCreditCard = async (
  request: FastifyRequest<{
    Params: { orderNumber: string };
    Body: PayByCreditCardRequest;
  }>,
  reply: FastifyReply
) => {
  const { t, params, body, tokenJwtData } = request;
  const service = container.resolve(PayerCreditCardByOrderIdUseCase);

  try {
    const result = await service.pay(
      t,
      tokenJwtData.clientId,
      params.orderNumber,
      body
    );

    if (!result.status) {
      return sendResponse(reply, {
        data: result.data,
        httpStatusCode: result.httpStatusCode,
      });
    }

    return sendResponse(reply, {
      data: result.data,
      httpStatusCode: HTTPStatusCode.CREATED,
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
      if (error.message === 'invalid_card_number') {
        return sendResponse(reply, {
          message: t('invalid_card_number'),
          httpStatusCode: HTTPStatusCode.BAD_REQUEST,
        });
      }

      if (error.message === 'expired_card_error') {
        return sendResponse(reply, {
          message: t('expired_card_error'),
          httpStatusCode: HTTPStatusCode.BAD_REQUEST,
        });
      }

      if (error.message === t('something_went_wrong_to_generate_credit_card')) {
        return sendResponse(reply, {
          message: t('something_went_wrong_to_generate_credit_card'),
          httpStatusCode: HTTPStatusCode.BAD_REQUEST,
        });
      }
    }

    return sendResponse(reply, {
      message: t('internal_server_error'),
      httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
