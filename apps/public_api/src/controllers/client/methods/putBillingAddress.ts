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
    await clientAddressUpdaterUseCase.updateBilling(
      tokenJwtData.clientId,
      request.body
    );

    return sendResponse(reply, {
      data: request.body,
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
