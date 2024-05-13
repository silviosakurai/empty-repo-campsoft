import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { PayerPixByOrderIdUseCase } from '@core/useCases/order/PayerPixByOrderId.useCase';
import { sendResponse } from '@core/common/functions/sendResponse';
import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';

export const paymentByPix = async (
  request: FastifyRequest<{
    Params: { orderNumber: string };
  }>,
  reply: FastifyReply
) => {
  const service = container.resolve(PayerPixByOrderIdUseCase);

  const { t, params } = request;

  try {
    const result = await service.pay(t, params.orderNumber);

    if (!result.status) {
      return sendResponse(reply, {
        data: result.data,
        httpStatusCode: result.httpStatusCode,
      });
    }

    return sendResponse(reply, {
      httpStatusCode: HTTPStatusCode.CREATED,
      data: result.data,
    });
  } catch (error) {
    request.server.logger.error(error, request.id);

    if (error instanceof Error) {
      return sendResponse(reply, {
        message: error.message,
        httpStatusCode: HTTPStatusCode.BAD_REQUEST,
      });
    }

    return sendResponse(reply, {
      message: t('internal_server_error'),
      httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
