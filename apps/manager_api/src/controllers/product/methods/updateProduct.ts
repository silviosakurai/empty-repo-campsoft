import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { UpdateProductRequest } from '@core/useCases/product/dtos/UpdateProductRequest.dto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { ProductsUpdaterUseCase } from '@core/useCases/product/ProductsUpdater.useCase';
import { ProductUpdateNotAllowedError } from '@core/common/exceptions/ProductUpdateNotAllowedError';

export const updateProduct = async (
  request: FastifyRequest<{
    Body: UpdateProductRequest;
    Params: { sku: string };
  }>,
  reply: FastifyReply
) => {
  const service = container.resolve(ProductsUpdaterUseCase);
  const { t, tokenJwtData } = request;

  try {
    const response = await service.update(t, tokenJwtData, {
      productId: request.params.sku,
      request: request.body,
    });

    if (!response) {
      request.server.logger.warn(response, request.id);

      return sendResponse(reply, {
        message: t('error_update_product'),
        httpStatusCode: HTTPStatusCode.NOT_FOUND,
      });
    }

    return sendResponse(reply, {
      httpStatusCode: HTTPStatusCode.OK,
    });
  } catch (error) {
    request.server.logger.error(error, request.id);

    if (error instanceof ProductUpdateNotAllowedError) {
      return sendResponse(reply, {
        message: t('product_update_not_allowed'),
        httpStatusCode: HTTPStatusCode.FORBIDDEN,
      });
    }

    return sendResponse(reply, {
      message: t('internal_server_error'),
      httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
