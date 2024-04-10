import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';
import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { ClientImageUpdaterUseCase } from '@core/useCases/client/ClientImageUpdater.useCase';
import { UpdateClientImageRequest } from '@core/useCases/client/dtos/UpdateClientImageRequest.dto';

export const patchImage = async (
  request: FastifyRequest<{
    Body: UpdateClientImageRequest;
  }>,
  reply: FastifyReply
) => {
  const { t, tokenJwtData } = request;
  const clientImageUpdaterUseCase = container.resolve(
    ClientImageUpdaterUseCase
  );

  try {
    const response = await clientImageUpdaterUseCase.update(
      t,
      tokenJwtData.clientId,
      request.body.image
    );

    return sendResponse(reply, {
      data: response,
      httpStatusCode: HTTPStatusCode.OK,
    });
  } catch (error) {
    request.server.logger.error(error, request.id);

    if (error instanceof Error) {
      return sendResponse(reply, {
        message: error.message,
        httpStatusCode: HTTPStatusCode.BAD_REQUEST,
      });
    }

    return sendResponse(reply, {
      message: t('internal_server_error'),
      httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
