import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { TokenRequest } from '@core/useCases/auth/dtos/TokenRequest.dto';
import { TokenAuthUseCase } from '@core/useCases/auth/TokenAuth.useCase';
import { container } from 'tsyringe';
import { ViewApiJwtRequest } from '@core/useCases/api/dtos/ViewApiJwtRequest.dto';

export const token = async (
  request: FastifyRequest<{
    Body: TokenRequest;
  }>,
  reply: FastifyReply
) => {
  const tokenAuthUseCase = container.resolve(TokenAuthUseCase);
  const { login_token } = request.body;
  const { t, tokenKeyData } = request;

  try {
    const responseToken = await tokenAuthUseCase.execute(
      tokenKeyData,
      login_token
    );

    if (responseToken) {
      const payload = {
        clientId: responseToken.client_id,
      } as ViewApiJwtRequest;

      const token = await reply.jwtSign(payload);

      return sendResponse(reply, {
        message: t('login_success'),
        httpStatusCode: HTTPStatusCode.OK,
        data: {
          result: responseToken,
          token,
        },
      });
    }

    request.server.logger.info(responseToken, request.id);

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
