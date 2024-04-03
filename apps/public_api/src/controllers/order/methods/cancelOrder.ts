import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { CancelOrderUseCase } from '@core/useCases/order/CancelOrder.useCase';
import { ListPaymentRequestDto } from '@core/useCases/order/dtos/ListPaymentRequest.dto';
import { container } from 'tsyringe';

export const cancelOrder = async (
  request: FastifyRequest<{
    Params: ListPaymentRequestDto;
  }>,
  reply: FastifyReply
) => {
  const cancelOrderUseCase = container.resolve(CancelOrderUseCase);
  const { t, tokenKeyData, tokenJwtData } = request;
  const { orderNumber } = request.params;

  try {
    const response = await cancelOrderUseCase.execute(
      orderNumber,
      tokenKeyData,
      tokenJwtData
    );

    if (!response) {
      return sendResponse(reply, {
        message: t('order_not_found'),
        httpStatusCode: HTTPStatusCode.NOT_FOUND,
      });
    }

    return sendResponse(reply, {
      data: response,
      httpStatusCode: HTTPStatusCode.OK,
    });
  } catch (error) {
    request.server.logger.error(error, request.id);

    return sendResponse(reply, {
      message: t('internal_server_error'),
      httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
