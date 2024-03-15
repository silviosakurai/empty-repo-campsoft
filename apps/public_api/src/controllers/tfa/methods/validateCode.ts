import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { ValidateCodeTFARequest } from '@core/useCases/tfa/dtos/ValidateCodeTFARequest.dto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ValidateCodeTFAUserCase } from '@core/useCases/tfa/ValidateCodeTFA.useCase';
import { container } from 'tsyringe';
import { ValidateCodeTFAResponse } from '@core/useCases/tfa/dtos/ValidateCodeTFAResponse.dto';

export const validateCode = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const validateCodeTFA = container.resolve(ValidateCodeTFAUserCase);
  const { t } = request;
  const { login, code } = request.body as ValidateCodeTFARequest;

  const response = await validateCodeTFA.execute({
    login,
    code,
  } as ValidateCodeTFARequest);

  try {
    if (!response) {
      request.server.logger.warn(response, request.id);

      return sendResponse(reply, {
        message: t('error_validate_code_verification'),
        httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
      });
    }

    const token = await reply.jwtSign(
      {
        token: response.token,
      },
      {
        expiresIn: '30m',
      }
    );

    const payloadResponse = {
      token,
    } as ValidateCodeTFAResponse;

    return sendResponse(reply, {
      data: payloadResponse,
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
