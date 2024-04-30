import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import {
  UpdateProductGroupBodyRequest,
  UpdateProductGroupParamsRequest,
} from '@core/useCases/product/dtos/UpdateProductGroupRequest.dto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { ProductsGroupUpdaterUseCase } from '@core/useCases/product/ProductsGroupUpdater.useCase';
import { ProductUpdateNotAllowedError } from '@core/common/exceptions/ProductUpdateNotAllowedError';

export const updateProductGroup = async (
  request: FastifyRequest<{
    Body: UpdateProductGroupBodyRequest;
    Params: UpdateProductGroupParamsRequest;
  }>,
  reply: FastifyReply
) => {
  const productsGroupUpdaterUseCase = container.resolve(
    ProductsGroupUpdaterUseCase
  );
  const { t } = request;

  try {
    const response = await productsGroupUpdaterUseCase.update(
      t,
      request.params.groupId,
      request.body
    );

    if (!response) {
      request.server.logger.warn(response, request.id);

      return sendResponse(reply, {
        message: t('error_update_product_group'),
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
