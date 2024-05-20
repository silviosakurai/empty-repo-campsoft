import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateCartUseCase } from '@core/useCases/cart/CreateCart.useCase';
import { container } from 'tsyringe';
import { CreateCartRequest } from '@core/useCases/cart/dtos/CreateCartRequest.dto';
import { sendResponse } from '@core/common/functions/sendResponse';
import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';

export const createCart = async (
  request: FastifyRequest<{ Body: CreateCartRequest }>,
  reply: FastifyReply
) => {
  const service = container.resolve(CreateCartUseCase);
  const { t, tokenKeyData, tokenJwtData } = request;

  try {
    const data = await service.create(
      t,
      tokenKeyData,
      tokenJwtData,
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
