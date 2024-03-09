import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { SendCodeTFARequest } from '@core/useCases/tfa/dtos/SendCodeTFARequest.dto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { SendWhatsAppTFAUserCase } from '@core/useCases/tfa/SendWhatsAppTFA.useCase';
import { SendSmsTFAUserCase } from '@core/useCases/tfa/SendSmsTFA.useCase';
import { SendEmailTFAUserCase } from '@core/useCases/tfa/SendEmailTFA.useCase';
import { SendUserIdTFAUserCase } from '@core/useCases/tfa/SendUserIdTFA.useCase';
import { container } from 'tsyringe';
import { TFAType } from '@core/common/enums/models/tfa';
import { ViewApiResponse } from '@core/useCases/api/dtos/ViewApiResponse.dto';
import { isUuid } from '@core/common/functions/isUuid';
import { TFunction } from 'i18next';
import { TFAVerificationError } from '@core/common/exceptions/TFAVerificationError';

const handleTfaType = async (
  type: TFAType,
  apiAccess: ViewApiResponse,
  login: string
): Promise<boolean> => {
  let service;

  if (type === TFAType.WHATSAPP) {
    service = container.resolve(SendWhatsAppTFAUserCase);
  }

  if (type === TFAType.SMS) {
    service = container.resolve(SendSmsTFAUserCase);
  }

  if (type === TFAType.EMAIL) {
    service = container.resolve(SendEmailTFAUserCase);
  }

  if (!service) {
    return false;
  }

  return service.execute({ apiAccess, type, login } as SendCodeTFARequest);
};

const loginUserId = async (
  t: TFunction<'translation', undefined>,
  type: TFAType,
  apiAccess: ViewApiResponse,
  login: string
): Promise<string> => {
  const isUuidValid = isUuid(login);

  if (isUuidValid) {
    const sendUserIdTFAUserCase = container.resolve(SendUserIdTFAUserCase);

    const userIdTFA = await sendUserIdTFAUserCase.execute({
      login,
      type,
      apiAccess,
    } as SendCodeTFARequest);

    if (!userIdTFA) {
      throw new TFAVerificationError(t('error_send_code_verification'));
    }

    return userIdTFA.login;
  }

  return login;
};

export const sendCode = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { t, apiAccess } = request;
  const { type, login } = request.body as SendCodeTFARequest;

  try {
    const userLogin = await loginUserId(t, type, apiAccess, login);
    const response = await handleTfaType(type, apiAccess, userLogin);

    if (!response) {
      return sendResponse(reply, {
        message: t('error_send_code_verification'),
        httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
      });
    }

    return sendResponse(reply, {
      httpStatusCode: HTTPStatusCode.OK,
    });
  } catch (error) {
    if (error instanceof TFAVerificationError) {
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
