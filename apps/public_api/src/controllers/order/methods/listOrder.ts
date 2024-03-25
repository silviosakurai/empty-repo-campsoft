import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ListOrdersUseCase } from '@core/useCases/order/ListOrders.useCase';
import { ListOrderRequestDto } from '@core/useCases/order/dtos/ListOrderRequest.dto';
import { container } from 'tsyringe';

export const listOrder = async (
  request: FastifyRequest<{
    Querystring: ListOrderRequestDto;
  }>,
  reply: FastifyReply
) => {
  const listOrdersUseCase = container.resolve(ListOrdersUseCase);
  const { t, tokenKeyData, tokenJwtData } = request;
  const input = request.query;

  try {
    const response = await listOrdersUseCase.execute(
      input,
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
