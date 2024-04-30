import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { PayerCreditCardByOrderIdUseCase } from '@core/useCases/order/PayerCreditCardByOrderId.useCase';
import { PayByCreditCardRequest } from '@core/useCases/order/dtos/PayByCreditCardRequest.dto';
import CreditCardExpirationDateIsInvalidError from '@core/common/exceptions/CreditCardExpirationDateIsInvalidError';
import { OrderService } from '@core/services';
import { OrderStatusEnum } from '@core/common/enums/models/order';

export const paymentByCreditCard = async (
  request: FastifyRequest<{
    Params: { orderNumber: string };
    Body: PayByCreditCardRequest;
  }>,
  reply: FastifyReply
) => {
  const { t, params, body } = request;
  const service = container.resolve(PayerCreditCardByOrderIdUseCase);
  const handleOrderStatus = container.resolve(OrderService);

  try {
    const result = await service.pay(t, params.orderNumber, body);

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

    await handleOrderStatus.updateStatusByOrderId(
      params.orderNumber,
      OrderStatusEnum.FAILED
    );

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
