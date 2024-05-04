import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ProductsToPartnerAdderUseCase } from '@core/useCases/product/ProductsToPartnerAdder.useCase';
import { container } from 'tsyringe';
import {
  AddProductToPartnerParamsRequest,
  AddProductToPartnerBodyRequest,
} from '@core/useCases/product/dtos/AddProductToPartnerRequest.dto';

export const addProductToPartner = async (
  request: FastifyRequest<{
    Params: AddProductToPartnerParamsRequest;
    Body: AddProductToPartnerBodyRequest;
  }>,
  reply: FastifyReply
) => {
  const productsToPartnerAdderUseCase = container.resolve(
    ProductsToPartnerAdderUseCase
  );
  const { t } = request;

  try {
    const response = await productsToPartnerAdderUseCase.execute(
      request.params.partnerId,
      request.body
    );

    if (!response) {
      request.server.logger.warn(response, request.id);

      return sendResponse(reply, {
        message: t('error_update_product_group_products'),
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
