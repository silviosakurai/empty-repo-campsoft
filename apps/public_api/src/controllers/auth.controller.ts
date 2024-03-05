import { FastifyReply, FastifyRequest } from 'fastify';
import { LoginAuthUseCase } from '@core/useCases/auth/LoginAuth.useCase';
import { injectable } from 'tsyringe';
import { LoginRequest } from '@core/useCases/auth/dtos/LoginRequest.dto';
import { sendResponse } from '@core/common/functions/sendResponse';
import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';

@injectable()
class AuthController {
  private loginAuthUseCase: LoginAuthUseCase;

  constructor(loginAuthUseCase: LoginAuthUseCase) {
    this.loginAuthUseCase = loginAuthUseCase;
  }

  public login = async (
    request: FastifyRequest<{
      Body: LoginRequest;
    }>,
    reply: FastifyReply
  ) => {
    const { login, password } = request.body;
    const { t } = request;

    try {
      const responseAuth = await this.loginAuthUseCase.execute({
        login,
        password,
      });

      if (responseAuth) {
        const token = await reply.jwtSign({ id: responseAuth.client_id });

        return sendResponse(reply, {
          message: t('login_success'),
          httpStatusCode: HTTPStatusCode.OK,
          data: {
            result: responseAuth,
            token,
          },
        });
      }

      return sendResponse(reply, {
        message: t('login_invalid'),
        httpStatusCode: HTTPStatusCode.UNAUTHORIZED,
      });
    } catch (error) {
      return sendResponse(reply, {
        message: t('login_error'),
        httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
      });
    }
  };
}

export default AuthController;
