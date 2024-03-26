import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ListPaymentUseCase } from '@core/useCases/order/ListPayment.useCase';
import { ListPaymentRequestDto } from '@core/useCases/order/dtos/ListPaymentRequest.dto';
import { container } from 'tsyringe';

export const listPayment = async (
  request: FastifyRequest<{
    Params: ListPaymentRequestDto;
  }>,
  reply: FastifyReply
) => {
  const listPaymentUseCase = container.resolve(ListPaymentUseCase);
  const { t } = request;
  const { orderNumber } = request.params;

  try {
    const response = await listPaymentUseCase.execute(orderNumber);

    if (!response) {
      return sendResponse(reply, {
        message: t('payment_not_found'),
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
