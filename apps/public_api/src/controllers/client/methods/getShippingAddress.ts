import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { ClientAddressViewerUseCase } from '@core/useCases/client/ClientAddressViewer.useCase';

export const getShippingAddress = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { t, tokenJwtData } = request;
  const clientAddressViewerUseCase = container.resolve(
    ClientAddressViewerUseCase
  );

  try {
    const response = await clientAddressViewerUseCase.viewShipping(
      tokenJwtData.clientId
    );

    if (!response) {
      request.server.logger.warn(response, request.id);

      return sendResponse(reply, {
        message: t('shipping_address_not_found'),
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
