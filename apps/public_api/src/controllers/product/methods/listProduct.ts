import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ListProductUseCase } from '@core/useCases/product/ListProduct.useCase';
import { container } from 'tsyringe';
import { ListProductRequest } from '@core/useCases/product/dtos/ListProductRequest.dto';

export const listProduct = async (
  request: FastifyRequest<{
    Querystring: ListProductRequest;
  }>,
  reply: FastifyReply
) => {
  const listProductUseCase = container.resolve(ListProductUseCase);
  const { t, tokenKeyData } = request;

  try {
    const response = await listProductUseCase.execute(
      tokenKeyData.company_id,
      request.query
    );

    if (!response) {
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
    console.error(error);
    return sendResponse(reply, {
      message: t('internal_server_error'),
      httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
