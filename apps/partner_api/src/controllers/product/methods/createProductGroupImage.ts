import { FastifyReply, FastifyRequest } from 'fastify';
import {
  CreateProductGroupImageParamsRequest,
  CreateProductGroupImageBodyRequest,
} from '@core/useCases/product/dtos/CreateProductGroupImageRequest.dto';
import { sendResponse } from '@core/common/functions/sendResponse';
import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { container } from 'tsyringe';
import { ProductGroupImageCreatorUseCase } from '@core/useCases/product/ProductGroupImageCreator.useCase';
import { ProductNotFoundError } from '@core/common/exceptions/ProductNotFoundError';

export const createProductGroupImage = async (
  request: FastifyRequest<{
    Params: CreateProductGroupImageParamsRequest;
    Body: CreateProductGroupImageBodyRequest;
  }>,
  reply: FastifyReply
) => {
  const { t } = request;
  const productGroupImageCreatorUseCase = container.resolve(
    ProductGroupImageCreatorUseCase
  );

  try {
    const response = await productGroupImageCreatorUseCase.create(
      t,
      request.params.groupId,
      request.params.type,
      request.body.image
    );

    if (!response) {
      request.server.logger.warn(response, request.id);

      return sendResponse(reply, {
        message: t('product_group_update_not_allowed'),
        httpStatusCode: HTTPStatusCode.NOT_FOUND,
      });
    }

    return sendResponse(reply, {
      httpStatusCode: HTTPStatusCode.OK,
    });
  } catch (error) {
    request.server.logger.error(error, request.id);

    if (error instanceof ProductNotFoundError) {
      return sendResponse(reply, {
        message: error.message,
        httpStatusCode: HTTPStatusCode.NOT_FOUND,
      });
    }

    if (error instanceof Error) {
      return sendResponse(reply, {
        message: error.message,
        httpStatusCode: HTTPStatusCode.BAD_REQUEST,
      });
    }

    return sendResponse(reply, {
      message: t('internal_server_error'),
      httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
