import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { LoginRequest } from '@core/useCases/auth/dtos/LoginRequest.dto';
import { ViewApiJwtRequest } from '@core/useCases/api/dtos/ViewApiJwtRequest.dto';
import { LoginAuthUseCase } from '@core/useCases/auth/LoginAuth.useCase';
import { container } from 'tsyringe';

export const login = async (
  request: FastifyRequest<{
    Body: LoginRequest;
  }>,
  reply: FastifyReply
) => {
  const loginAuthUseCase = container.resolve(LoginAuthUseCase);
  const { login, password } = request.body;
  const { t } = request;

  try {
    const responseAuth = await loginAuthUseCase.execute({
      login,
      password,
    });

    if (responseAuth) {
      const payload = {
        clientId: responseAuth.auth.client_id,
      } as ViewApiJwtRequest;

      const token = await reply.jwtSign(payload);

      return sendResponse(reply, {
        message: t('login_success'),
        httpStatusCode: HTTPStatusCode.OK,
        data: {
          result: responseAuth,
          token,
        },
      });
    }

    request.server.logger.info(responseAuth, request.id);

    return sendResponse(reply, {
      message: t('login_invalid'),
      httpStatusCode: HTTPStatusCode.UNAUTHORIZED,
    });
  } catch (error) {
    request.server.logger.error(error, request.id);

    return sendResponse(reply, {
      message: t('login_error'),
      httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
