import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ProductFromGroupDeleterUseCase } from '@core/useCases/product/ProductFromGroupDeleter.useCase';
import { container } from 'tsyringe';
import { DeleteProductFromGroupParamsRequest } from '@core/useCases/product/dtos/DeleteProductFromGroupRequest.dto';

export const deleteProductFromGroup = async (
  request: FastifyRequest<{
    Params: DeleteProductFromGroupParamsRequest;
  }>,
  reply: FastifyReply
) => {
  const productFromGroupDeleterUseCase = container.resolve(
    ProductFromGroupDeleterUseCase
  );
  const { t } = request;

  try {
    const response = await productFromGroupDeleterUseCase.execute(
      request.params.groupId,
      request.params.productId
    );

    if (!response) {
      request.server.logger.warn(response, request.id);

      return sendResponse(reply, {
        message: t('product_group_relation_not_found'),
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
