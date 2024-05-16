import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { OrderHistoricUseCase } from '@core/useCases/order/OrderHistoricViewer.useCase';
import { container } from 'tsyringe';
import { ViewOrderPaymentHistoricRequest } from '@core/useCases/order/dtos/ViewOrderPaymentHistoricRequest.dto';

export const viewPaymentHistoric = async (
  request: FastifyRequest<{ Params: ViewOrderPaymentHistoricRequest }>,
  reply: FastifyReply
) => {
  const orderHistoricUseCase = container.resolve(OrderHistoricUseCase);
  const { t, tokenKeyData, tokenJwtData } = request;

  try {
    const response = await orderHistoricUseCase.execute(
      request.params.orderNumber,
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
