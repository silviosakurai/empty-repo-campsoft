import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ProductsListerUseCase } from '@core/useCases/product/ProductsLister.useCase';
import { container } from 'tsyringe';
import { ListAllProductRequest } from '@core/useCases/product/dtos/ListProductRequest.dto';

export const listAllProductUserLogged = async (
  request: FastifyRequest<{
    Querystring: ListAllProductRequest;
  }>,
  reply: FastifyReply
) => {
  const productListerUseCase = container.resolve(ProductsListerUseCase);
  const { t, tokenJwtData } = request;

  try {
    const response = await productListerUseCase.listLoggedNoPagination(
      tokenJwtData.clientId,
      request.query
    );

    return sendResponse(reply, {
      data: response,
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
