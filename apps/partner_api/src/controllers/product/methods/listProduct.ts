import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ProductsListerByCompanyUseCase } from '@core/useCases/product/ProductsListerByCompany.useCase';
import { container } from 'tsyringe';
import { ListProductByCompanyRequest } from '@core/useCases/product/dtos/ListProductByCompanyRequest.dto';

export const listProduct = async (
  request: FastifyRequest<{
    Querystring: ListProductByCompanyRequest;
  }>,
  reply: FastifyReply
) => {
  const productsListerByCompanyUseCase = container.resolve(
    ProductsListerByCompanyUseCase
  );
  const { t, tokenJwtData } = request;

  try {
    const response = await productsListerByCompanyUseCase.execute(
      tokenJwtData,
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
