import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';
import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { ProductViewerByCompanyUseCase } from '@core/useCases/product/ProductViewerByCompany.useCase';
import { ViewProductRequest } from '@core/useCases/product/dtos/ViewProductRequest.dto';

export const viewProduct = async (
  request: FastifyRequest<{
    Params: ViewProductRequest;
  }>,
  reply: FastifyReply
) => {
  const productViewerByCompanyUseCase = container.resolve(
    ProductViewerByCompanyUseCase
  );
  const { t, tokenJwtData } = request;

  try {
    const response = await productViewerByCompanyUseCase.execute(
      tokenJwtData,
      request.params.sku
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
