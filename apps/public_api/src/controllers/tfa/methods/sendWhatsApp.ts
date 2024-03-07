import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { SendWhatsAppTFARequest } from '@core/useCases/tfa/dtos/SendWhatsAppTFARequest.dto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { SendWhatsAppTFA } from '@core/useCases/tfa/SendWhatsAppTFA.useCase';
import { container } from 'tsyringe';

export const sendWhatsApp = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const sendWhatsAppTFA = container.resolve(SendWhatsAppTFA);
  const { t, apiAccess } = request;
  const { type, login } = request.body as SendWhatsAppTFARequest;

  try {
    const response = await sendWhatsAppTFA.execute({
      apiAccess,
      type,
      login,
    } as SendWhatsAppTFARequest);

    if (!response) {
      return sendResponse(reply, {
        message: t('error_send_code_whatsapp'),
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
