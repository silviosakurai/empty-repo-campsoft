import { FastifyReply, FastifyRequest } from 'fastify';
import {
  CreateProductImageParams,
  CreateProductImageRequest,
} from '@core/useCases/product/dtos/CreateProductImageRequest.dto';
import { sendResponse } from '@core/common/functions/sendResponse';
import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { container } from 'tsyringe';
import { ProductImageCreatorUseCase } from '@core/useCases/product/ProductImageCreator.useCase';
import { ProductNotFoundError } from '@core/common/exceptions/ProductNotFoundError';

export const createProductImage = async (
  request: FastifyRequest<{
    Params: CreateProductImageParams;
    Body: CreateProductImageRequest;
  }>,
  reply: FastifyReply
) => {
  const { t, tokenKeyData } = request;
  const service = container.resolve(ProductImageCreatorUseCase);

  try {
    const response = await service.create(t, tokenKeyData.company_id, {
      ...request.params,
      ...request.body,
    });

    if (!response) {
      request.server.logger.warn(response, request.id);

      return sendResponse(reply, {
        message: t('product_update_not_allowed'),
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
