import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ProductsListerUseCase } from '@core/useCases/product/ProductsLister.useCase';
import { container } from 'tsyringe';
import { ListProductRequest } from '@core/useCases/product/dtos/ListProductRequest.dto';

export const listProduct = async (
  request: FastifyRequest<{
    Querystring: ListProductRequest;
  }>,
  reply: FastifyReply
) => {
  const listProductUseCase = container.resolve(ProductsListerUseCase);
  const { t, tokenKeyData } = request;

  try {
    const response = await listProductUseCase.execute(
      tokenKeyData.company_id,
      request.query
    );

    if (!response) {
      request.server.logger.warn(response, request.id);

      return sendResponse(reply, {
        message: t('product_not_found'),
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
