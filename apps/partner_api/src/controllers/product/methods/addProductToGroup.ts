import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AddProductsToGroupUseCase } from '@core/useCases/product/AddProductsToGroup.useCase';
import { container } from 'tsyringe';
import {
  AddProductToGroupBodyRequest,
  AddProductToGroupParamsRequest,
} from '@core/useCases/product/dtos/AddProductToGroupRequest.dto';

export const addProductToGroup = async (
  request: FastifyRequest<{
    Params: AddProductToGroupParamsRequest;
    Body: AddProductToGroupBodyRequest;
  }>,
  reply: FastifyReply
) => {
  const addProductsToGroupUseCase = container.resolve(
    AddProductsToGroupUseCase
  );
  const { t } = request;

  try {
    const response = await addProductsToGroupUseCase.execute(
      request.params.groupId,
      request.body
    );

    if (!response) {
      request.server.logger.warn(response, request.id);

      return sendResponse(reply, {
        message: t('error_update_product_group'),
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
