import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { ClientPasswordUpdaterUseCase } from '@core/useCases/client/ClientPasswordUpdater.useCase';
import { sendResponse } from '@core/common/functions/sendResponse';
import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { UpdatePasswordClientRequestDto } from '@core/useCases/client/dtos/UpdatePasswordClientRequest.dto';

export const updatePasswordClient = async (
  request: FastifyRequest<{
    Body: UpdatePasswordClientRequestDto;
    Params: {
      new_password: string;
    };
  }>,
  reply: FastifyReply
) => {
  const clientPasswordUpdaterUseCase = container.resolve(
    ClientPasswordUpdaterUseCase
  );
  const { t, apiAccess, tfaInfo } = request;

  try {
    const response = await clientPasswordUpdaterUseCase.update(
      tfaInfo,
      apiAccess,
      request.body
    );

    if (!response) {
      return sendResponse(reply, {
        message: t('client_not_found'),
        httpStatusCode: HTTPStatusCode.BAD_REQUEST,
      });
    }

    return sendResponse(reply, {
      message: t('user_password_updated_successfully'),
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
