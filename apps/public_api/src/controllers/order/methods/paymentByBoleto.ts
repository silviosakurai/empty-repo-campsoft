import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { PayerByBoletoByOrderIdUseCase } from '@core/useCases/order/PayerBoletoByOrderId.useCase';
import { sendResponse } from '@core/common/functions/sendResponse';
import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';

export const paymentByBoleto = async (
  request: FastifyRequest<{
    Params: { orderNumber: string };
  }>,
  reply: FastifyReply
) => {
  const service = container.resolve(PayerByBoletoByOrderIdUseCase);

  const { t, params, tokenKeyData } = request;

  try {
    const result = await service.pay(t, tokenKeyData, params.orderNumber);

    if (!result.status) {
      return sendResponse(reply, {
        data: result.data,
        httpStatusCode: result.httpStatusCode,
      });
    }

    return sendResponse(reply, {
      data: result,
      httpStatusCode: HTTPStatusCode.OK,
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
