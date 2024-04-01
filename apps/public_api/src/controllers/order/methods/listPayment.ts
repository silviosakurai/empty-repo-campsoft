import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { PaymentListerUseCase } from '@core/useCases/order/PaymentLister.useCase';
import { ListPaymentRequestDto } from '@core/useCases/order/dtos/ListPaymentRequest.dto';
import { container } from 'tsyringe';

export const listPayment = async (
  request: FastifyRequest<{
    Params: ListPaymentRequestDto;
  }>,
  reply: FastifyReply
) => {
  const paymentListerUseCase = container.resolve(PaymentListerUseCase);
  const { t, tokenKeyData, tokenJwtData } = request;
  const { orderNumber } = request.params;

  try {
    const response = await paymentListerUseCase.execute(
      orderNumber,
      tokenKeyData,
      tokenJwtData
    );

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
