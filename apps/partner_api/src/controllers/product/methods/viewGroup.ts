import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';
import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { ProductGroupViewerUseCase } from '@core/useCases/product/ProductGroupViewer.useCase';
import { ViewProductGroupRequest } from '@core/useCases/product/dtos/ViewProductGroupRequest.dto';

export const viewGroup = async (
  request: FastifyRequest<{
    Params: ViewProductGroupRequest;
  }>,
  reply: FastifyReply
) => {
  const productGroupViewerUseCase = container.resolve(
    ProductGroupViewerUseCase
  );
  const { t } = request;

  try {
    const response = await productGroupViewerUseCase.execute(
      request.params.groupId
    );

    if (!response) {
      request.server.logger.warn(response, request.id);

      return sendResponse(reply, {
        message: t('product_group_not_found'),
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
