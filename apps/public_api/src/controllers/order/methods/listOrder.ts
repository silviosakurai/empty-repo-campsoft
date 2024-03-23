import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ListOrdersUseCase } from '@core/useCases/order/ListOrders.useCase';
import { container } from 'tsyringe';

export const listOrder = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const listOrdersUseCase = container.resolve(ListOrdersUseCase);
  const { t, tokenKeyData, tokenJwtData } = request;

  try {
    const response = await listOrdersUseCase.execute(
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
