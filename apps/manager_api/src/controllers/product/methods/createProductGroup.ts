import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateProductGroupBodyRequest } from '@core/useCases/product/dtos/CreateProductGroupRequest.dto';
import { sendResponse } from '@core/common/functions/sendResponse';
import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { container } from 'tsyringe';
import { ProductGroupCreatorUseCase } from '@core/useCases/product/ProductGroupCreator.useCase';
import { ProductNotFoundError } from '@core/common/exceptions/ProductNotFoundError';

export const createProductGroup = async (
  request: FastifyRequest<{
    Body: CreateProductGroupBodyRequest;
  }>,
  reply: FastifyReply
) => {
  const { t } = request;
  const productGroupCreatorUseCase = container.resolve(
    ProductGroupCreatorUseCase
  );

  try {
    const response = await productGroupCreatorUseCase.create(
      t,
      request.body.name,
      request.body.choices
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
