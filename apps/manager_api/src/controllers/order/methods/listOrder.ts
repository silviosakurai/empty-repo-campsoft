import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ListOrderRequestDto } from '@core/useCases/order/dtos/ListOrderRequest.dto';

export const listOrder = async (
  request: FastifyRequest<{
    Querystring: ListOrderRequestDto;
  }>,
  reply: FastifyReply
) => {
  const { t } = request;

  try {
    return sendResponse(reply, {
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
