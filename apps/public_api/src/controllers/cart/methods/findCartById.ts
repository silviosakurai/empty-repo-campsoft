import { FastifyReply, FastifyRequest } from 'fastify';
import { ListerCartUseCase } from '@core/useCases/cart/ListerCart.useCase';
import { container } from 'tsyringe';
import { ListCartRequest } from '@core/useCases/cart/dtos/ListCartRequest.dto';
import { sendResponse } from '@core/common/functions/sendResponse';
import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';

export const findCartById = async (
  request: FastifyRequest<{ Params: ListCartRequest }>,
  reply: FastifyReply
) => {
  const listerCartUseCase = container.resolve(ListerCartUseCase);
  const { t } = request;

  const cartId = request.params.cartId;

  if (!cartId) {
    return sendResponse(reply, {
      message: t('cart_id_required'),
      httpStatusCode: HTTPStatusCode.BAD_REQUEST,
    });
  }

  try {
    const data = await listerCartUseCase.getCart(t, cartId);

    return sendResponse(reply, {
      data,
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
