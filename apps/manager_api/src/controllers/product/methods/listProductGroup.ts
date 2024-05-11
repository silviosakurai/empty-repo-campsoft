import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ProductGroupListerUseCase } from '@core/useCases/product/ProductGroupLister.useCase';
import { container } from 'tsyringe';
import { ListProductByCompanyRequest } from '@core/useCases/product/dtos/ListProductByCompanyRequest.dto';

export const listProductGroup = async (
  request: FastifyRequest<{
    Querystring: ListProductByCompanyRequest;
  }>,
  reply: FastifyReply
) => {
  const productGroupListerUseCase = container.resolve(
    ProductGroupListerUseCase
  );
  const { t, tokenJwtData } = request;

  try {
    const response = await productGroupListerUseCase.execute(t, tokenJwtData);

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
