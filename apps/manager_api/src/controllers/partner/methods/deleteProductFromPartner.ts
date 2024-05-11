import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ProductFromPartnerDeleterUseCase } from '@core/useCases/product/ProductFromPartnerDeleter.useCase';
import { container } from 'tsyringe';
import { DeleteProductFromPartnerParamsRequest } from '@core/useCases/product/dtos/DeleteProductFromPartnerRequest.dto';

export const deleteProductFromPartner = async (
  request: FastifyRequest<{
    Params: DeleteProductFromPartnerParamsRequest;
  }>,
  reply: FastifyReply
) => {
  const productFromPartnerDeleterUseCase = container.resolve(
    ProductFromPartnerDeleterUseCase
  );
  const { t } = request;

  try {
    const response = await productFromPartnerDeleterUseCase.execute(
      request.params.partnerId,
      request.params.productId
    );

    if (!response) {
      request.server.logger.warn(response, request.id);

      return sendResponse(reply, {
        message: t('product_partner_relation_not_found'),
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
