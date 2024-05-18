import { FastifyReply, FastifyRequest } from 'fastify';
import { EditCartUseCase } from '@core/useCases/cart/EditCart.useCase';
import { container } from 'tsyringe';
import { CreateCartRequest } from '@core/useCases/cart/dtos/CreateCartRequest.dto';
import { sendResponse } from '@core/common/functions/sendResponse';
import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { ListCartRequest } from '@core/useCases/cart/dtos/ListCartRequest.dto';

export const editCart = async (
  request: FastifyRequest<{ Params: ListCartRequest; Body: CreateCartRequest }>,
  reply: FastifyReply
) => {
  const editCartUseCase = container.resolve(EditCartUseCase);
  const { t, tokenKeyData, tokenJwtData } = request;

  if (!request.params.cartId) {
    return sendResponse(reply, {
      message: t('cart_not_found'),
      httpStatusCode: HTTPStatusCode.BAD_REQUEST,
    });
  }

  try {
    const data = await editCartUseCase.edit(
      t,
      tokenKeyData,
      tokenJwtData,
      request.params.cartId,
      request.body
    );

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
