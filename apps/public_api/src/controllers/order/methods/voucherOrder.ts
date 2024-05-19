import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { VoucherOrderUseCase } from '@core/useCases/order/VoucherOrder.useCase';
import { VoucherOrderRequestDto } from '@core/useCases/order/dtos/CreateOrderRequest.dto';
import { container } from 'tsyringe';

export const voucherOrder = async (
  request: FastifyRequest<{
    Body: VoucherOrderRequestDto;
  }>,
  reply: FastifyReply
) => {
  const voucherOrderUseCase = container.resolve(VoucherOrderUseCase);
  const { t, tokenKeyData, tokenJwtData } = request;

  try {
    const response = await voucherOrderUseCase.execute(
      t,
      tokenKeyData,
      tokenJwtData,
      request.body
    );

    return sendResponse(reply, {
      data: response,
      httpStatusCode: HTTPStatusCode.OK,
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
