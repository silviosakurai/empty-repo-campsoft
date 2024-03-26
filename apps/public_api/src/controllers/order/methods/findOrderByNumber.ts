import { FastifyReply, FastifyRequest } from 'fastify';
import { FindOrderByNumberRequest } from '@core/useCases/order/dtos/FindOrderByNumberRequest.dto';
import { container } from 'tsyringe';
import { FindOrderByNumberUseCase } from '@core/useCases/order/FindOrderByNumber.useCase';
import { sendResponse } from '@core/common/functions/sendResponse';
import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';

export const findOrderByNumber = async (
  request: FastifyRequest<{ Params: FindOrderByNumberRequest }>,
  reply: FastifyReply
) => {
  const service = container.resolve(FindOrderByNumberUseCase);
  const { t, tokenKeyData, tokenJwtData } = request;

  try {
    const data = await service.find(
      request.params.orderNumber,
      tokenKeyData,
      tokenJwtData
    );

    if (!data) {
      return sendResponse(reply, {
        message: t('order_not_found'),
        httpStatusCode: HTTPStatusCode.NOT_FOUND,
      });
    }

    return sendResponse(reply, {
      data,
      httpStatusCode: HTTPStatusCode.OK,
    });
  } catch (error) {
    console.error(error);
    request.server.logger.error(error, request.id);

    return sendResponse(reply, {
      message: t('internal_server_error'),
      httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
