import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ViewProductUseCase } from '@core/useCases/product/ViewProduct.useCase';
import { container } from 'tsyringe';
import { ViewProductRequest } from '@core/useCases/product/dtos/ViewProductRequest.dto';

export const viewProduct = async (
  request: FastifyRequest<{
    Params: ViewProductRequest;
  }>,
  reply: FastifyReply
) => {
  const viewProductUseCase = container.resolve(ViewProductUseCase);
  const { t, tokenKeyData } = request;
 
  try {
      const response = await viewProductUseCase.execute(
        tokenKeyData.company_id,
        request.params.sku,
      );
        
        if (!response) {
            return sendResponse(reply, {
                message: t('product_not_found'),
                httpStatusCode: HTTPStatusCode.NOT_FOUND,
      });
    }

    return sendResponse(reply, {
        data: response,
        httpStatusCode: HTTPStatusCode.OK,
    });
} catch (error) {
    console.error(error);
    return sendResponse(reply, {
      message: t('internal_server_error'),
      httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
