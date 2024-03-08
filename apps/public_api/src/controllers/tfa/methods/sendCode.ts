import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { SendCodeTFARequest } from '@core/useCases/tfa/dtos/SendCodeTFARequest.dto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { SendWhatsAppTFA } from '@core/useCases/tfa/SendWhatsAppTFA.useCase';
import { SendSmsTFA } from '@core/useCases/tfa/SendSmsTFA.useCase';
import { container } from 'tsyringe';
import { TFAType } from '@core/common/enums/models/tfa';

export const sendCode = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { t, apiAccess } = request;
  const { type, login } = request.body as SendCodeTFARequest;

  try {
    let response = false;

    if (type === TFAType.WHATSAPP) {
      const sendWhatsAppTFA = container.resolve(SendWhatsAppTFA);

      response = await sendWhatsAppTFA.execute({
        apiAccess,
        type,
        login,
      } as SendCodeTFARequest);
    }

    if (type === TFAType.SMS) {
      const sendSmsTFA = container.resolve(SendSmsTFA);

      response = await sendSmsTFA.execute({
        apiAccess,
        type,
        login,
      } as SendCodeTFARequest);
    }

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
