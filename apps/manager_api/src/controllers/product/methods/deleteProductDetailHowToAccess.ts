import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { ProductsDetailHowToAccessDeleterUseCase } from '@core/useCases/product/ProductsDetailHowToAccessDeleter.useCase';

export const deleteProductDetailHowToAccess = async (
  request: FastifyRequest<{
    Params: { sku: string };
  }>,
  reply: FastifyReply
) => {
  const productsDetailHowToAccessDeleterUseCase = container.resolve(
    ProductsDetailHowToAccessDeleterUseCase
  );
  const { t, tokenJwtData } = request;

  try {
    const response =
      await productsDetailHowToAccessDeleterUseCase.deleteDetailsHowToAccess(
        t,
        tokenJwtData,
        {
          productId: request.params.sku,
        }
      );

    if (!response) {
      request.server.logger.warn(response, request.id);

      return sendResponse(reply, {
        message: t('product_how_to_access_type_not_found'),
        httpStatusCode: HTTPStatusCode.NOT_FOUND,
      });
    }

    return sendResponse(reply, {
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
