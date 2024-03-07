import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { ClientPhoneUpdaterUseCase } from '@core/useCases/client/ClientPhoneUpdater.useCase';
import { UpdatePhoneClientRequestDto } from '@core/useCases/client/dtos/UpdatePhoneClientRequest.dto';
import { sendResponse } from '@core/common/functions/sendResponse';
import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';

export const updatePhoneClient = async (
  request: FastifyRequest<{
    Body: UpdatePhoneClientRequestDto;
    Params: {
      id: string;
    };
  }>,
  reply: FastifyReply
) => {
  const clientUseCase = container.resolve(ClientPhoneUpdaterUseCase);
  const { t, apiAccess } = request;

  try {
    const response = await clientUseCase.update(
      request.params.id,
      request.body,
      apiAccess
    );

    if (!response) {
      return sendResponse(reply, {
        message: 'client_not_found',
        httpStatusCode: HTTPStatusCode.BAD_REQUEST,
      });
    }

    return sendResponse(reply, {
      message: 'user_phone_updated_successfully',
      httpStatusCode: HTTPStatusCode.OK,
    });
  } catch (error) {
    console.log(error);
    return sendResponse(reply, {
      message: t('internal_server_error'),
      httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
