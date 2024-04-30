import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { UpdateProductDetailHowToAccessRequest } from '@core/useCases/product/dtos/UpdateProductDetaiHowToAccessRequest.dto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { ProductsDetailHowToAccessUpdaterUseCase } from '@core/useCases/product/ProductsDetailHowToAccessUpdater.useCase';

export const updateProductDetailHowToAccess = async (
  request: FastifyRequest<{
    Body: UpdateProductDetailHowToAccessRequest;
    Params: { sku: string };
  }>,
  reply: FastifyReply
) => {
  const service = container.resolve(ProductsDetailHowToAccessUpdaterUseCase);
  const { t, tokenKeyData } = request;

  try {
    const response = await service.updateDetailsHowToAccess(
      t,
      tokenKeyData.company_id,
      {
        productId: request.params.sku,
        request: request.body,
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
