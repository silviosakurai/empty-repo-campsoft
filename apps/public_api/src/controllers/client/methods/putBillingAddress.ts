import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';
import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { ClientAddressUpdaterUseCase } from '@core/useCases/client/ClientAddressUpdater.useCase';
import { UpdateClientAddressRequest } from '@core/useCases/client/dtos/UpdateClientAddressRequest.dto';

export const putBillingAddress = async (
  request: FastifyRequest<{
    Body: UpdateClientAddressRequest;
  }>,
  reply: FastifyReply
) => {
  const { t, tokenJwtData } = request;
  const clientAddressUpdaterUseCase = container.resolve(
    ClientAddressUpdaterUseCase
  );

  try {
    const update = await clientAddressUpdaterUseCase.updateBilling(
      tokenJwtData.clientId,
      request.body
    );

    if (!update) {
      return sendResponse(reply, {
        message: t('error_updating_billing_address'),
        httpStatusCode: HTTPStatusCode.BAD_REQUEST,
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
