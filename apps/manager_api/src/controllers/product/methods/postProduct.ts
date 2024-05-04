import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ProductsCreatorUseCase } from '@core/useCases/product/ProductsCreator.useCase';
import { container } from 'tsyringe';
import { CreateProductRequest } from '@core/useCases/product/dtos/CreateProductRequest.dto';

export const postProduct = async (
  request: FastifyRequest<{
    Body: CreateProductRequest;
  }>,
  reply: FastifyReply
) => {
  const productsCreatorUseCase = container.resolve(ProductsCreatorUseCase);
  const { t, tokenKeyData } = request;

  try {
    const response = await productsCreatorUseCase.execute(
      tokenKeyData.id_parceiro,
      request.body
    );

    if (!response) {
      request.server.logger.warn(response, request.id);

      return sendResponse(reply, {
        message: t('error_create_product'),
        httpStatusCode: HTTPStatusCode.NOT_FOUND,
      });
    }

    return sendResponse(reply, {
      data: request.body,
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
