import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { SendCodeTFARequest } from '@core/useCases/tfa/dtos/SendCodeTFARequest.dto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { SendWhatsAppTFA } from '@core/useCases/tfa/SendWhatsAppTFA.useCase';
import { SendSmsTFA } from '@core/useCases/tfa/SendSmsTFA.useCase';
import { SendEmailTFA } from '@core/useCases/tfa/SendEmailTFA.useCase';
import { container } from 'tsyringe';
import { TFAType } from '@core/common/enums/models/tfa';
import { ViewApiResponse } from '@core/useCases/api/dtos/ViewApiResponse.dto';

const handleTfaType = async (
  type: TFAType,
  apiAccess: ViewApiResponse,
  login: string
): Promise<boolean> => {
  let service;

  switch (type) {
    case TFAType.WHATSAPP:
      service = container.resolve(SendWhatsAppTFA);
      break;
    case TFAType.SMS:
      service = container.resolve(SendSmsTFA);
      break;
    case TFAType.EMAIL:
      service = container.resolve(SendEmailTFA);
      break;
    default:
      return false;
  }

  return service.execute({ apiAccess, type, login } as SendCodeTFARequest);
};

export const sendCode = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { t, apiAccess } = request;
  const { type, login } = request.body as SendCodeTFARequest;

  try {
    const response = await handleTfaType(type, apiAccess, login);

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
    return sendResponse(reply, {
      message: t('internal_server_error'),
      httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
