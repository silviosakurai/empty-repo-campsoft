import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { ListCrossSellProductUseCase } from '@core/useCases/product/ListCrossSellProduct.useCase';
import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { CrossSellProductRequest } from '@core/useCases/product/dtos/ListCrossSellProductRequest.dto';

export const listCrossSellProduct = async (
  request: FastifyRequest<{
    Querystring: Omit<CrossSellProductRequest, 'client_id'>;
  }>,
  reply: FastifyReply
) => {
  const service = container.resolve(ListCrossSellProductUseCase);
  const { t, tokenJwtData } = request;

  try {
    const response = await service.list({
      client_id: tokenJwtData.clientId,
      ...request.query,
    });

    if (!response) {
      return sendResponse(reply, {
        message: t('cross_sell_product_empty'),
        httpStatusCode: HTTPStatusCode.OK,
      });
    }

    return sendResponse(reply, {
      httpStatusCode: HTTPStatusCode.OK,
      data: response,
    });
  } catch (error) {
    request.server.logger.error(error, request.id);

    return sendResponse(reply, {
      message: t('internal_server_error'),
      httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
