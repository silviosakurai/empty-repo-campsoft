import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { UpdateProductRequest } from '@core/useCases/product/dtos/UpdateProductRequest.dto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { ProductsUpdaterUseCase } from '@core/useCases/product/ProductsUpdater.useCase';

export const updateProduct = async (
  request: FastifyRequest<{
    Querystring: UpdateProductRequest;
  }>,
  reply: FastifyReply
) => {
  const service = container.resolve(ProductsUpdaterUseCase);
  const { t, tokenKeyData } = request;

  try {
    // const response = await service.execute(
    //   tokenKeyData.company_id,
    //   request.body
    // );
    // if (!response) {
    //   request.server.logger.warn(response, request.id);
    //   return sendResponse(reply, {
    //     message: t('error_create_product'),
    //     httpStatusCode: HTTPStatusCode.NOT_FOUND,
    //   });
    // }
    // return sendResponse(reply, {
    //   data: request.body,
    //   httpStatusCode: HTTPStatusCode.OK,
    // });
  } catch (error) {
    request.server.logger.error(error, request.id);
    console.log(error);

    return sendResponse(reply, {
      message: t('internal_server_error'),
      httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
