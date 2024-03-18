import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { ListCrossSellProductUseCase } from '@core/useCases/product/ListCrossSellProduct.useCase';
import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';

export const listCrossSellProduct = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const service = container.resolve(ListCrossSellProductUseCase);
  const { t, tokenKeyData } = request;

  try {
    service.list();
  } catch (error) {
    request.server.logger.error(error, request.id);

    return sendResponse(reply, {
      message: t('internal_server_error'),
      httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
