import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { PayerCreditCardByOrderIdUseCase } from '@core/useCases/order/PayerCreditCardByOrderId.useCase';

export const paymentByCreditCard = async (
  request: FastifyRequest<{
    Params: { orderNumber: string };
  }>,
  reply: FastifyReply
) => {
  const { t, tokenKeyData, params } = request;
  const service = container.resolve(PayerCreditCardByOrderIdUseCase);

  try {
    const result = await service.pay(t, tokenKeyData, params.orderNumber);

    // if (!result) {
    //   return sendResponse(reply, {
    //     data: result.data,
    //     httpStatusCode: result.httpStatusCode,
    //   });
    // }
  } catch (error) {
    console.log(error);

    request.server.logger.error(error, request.id);

    return sendResponse(reply, {
      message: t('internal_server_error'),
      httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
