import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { PayerCreditCardByOrderIdUseCase } from '@core/useCases/order/PayerCreditCardByOrderId.useCase';
import { PayByCreditCardRequest } from '@core/useCases/order/dtos/PayByCreditCardRequest.dto';

export const paymentByCreditCard = async (
  request: FastifyRequest<{
    Params: { orderNumber: string };
    Body: PayByCreditCardRequest;
  }>,
  reply: FastifyReply
) => {
  const { t, tokenKeyData, params, body } = request;
  const service = container.resolve(PayerCreditCardByOrderIdUseCase);

  try {
    const result = await service.pay(t, tokenKeyData, params.orderNumber, body);

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
    console.log(error);

    request.server.logger.error(error, request.id);

    return sendResponse(reply, {
      message: t('internal_server_error'),
      httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
