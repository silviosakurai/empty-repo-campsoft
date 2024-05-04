import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ProductsListerByPartnerUseCase } from '@core/useCases/product/ProductsListerByPartner.useCase';
import { container } from 'tsyringe';
import {
  ListProductByPartnerParamsRequest,
  ListProductByPartnerRequest,
} from '@core/useCases/product/dtos/ListProductByPartnerRequest.dto';

export const listPartnerProducts = async (
  request: FastifyRequest<{
    Params: ListProductByPartnerParamsRequest;
    Querystring: ListProductByPartnerRequest;
  }>,
  reply: FastifyReply
) => {
  const productsListerByPartnerUseCase = container.resolve(
    ProductsListerByPartnerUseCase
  );
  const { t } = request;

  try {
    const response = await productsListerByPartnerUseCase.execute(
      request.params.partnerId,
      request.query
    );

    if (!response) {
      request.server.logger.warn(response, request.id);

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
    request.server.logger.error(error, request.id);

    return sendResponse(reply, {
      message: t('internal_server_error'),
      httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
