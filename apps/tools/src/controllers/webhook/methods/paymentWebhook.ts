import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { PaymentWebhookHandlerUseCase } from '@core/useCases/webhook/PaymentWebhookHandler.useCase';
import { PaymentWebhookHandlerRequest } from '@core/useCases/webhook/dtos/WebhookRequest.dto';

export const paymentWebhook = async (
  request: FastifyRequest<{
    Body: PaymentWebhookHandlerRequest;
  }>,
  reply: FastifyReply
) => {
  const service = container.resolve(PaymentWebhookHandlerUseCase);

  request.server.logger.trace(JSON.stringify(request.body), request.id);

  try {
    const result = await service.handle(request.body);

    if (!result) {
      return sendResponse(reply, {
        httpStatusCode: HTTPStatusCode.BAD_REQUEST,
        message: request.t('order_not_found'),
      });
    }

    return sendResponse(reply, {
      httpStatusCode: HTTPStatusCode.OK,
    });
  } catch (error) {
    request.server.logger.error(error, request.id);

    return sendResponse(reply, {
      message: request.t('internal_server_error'),
      httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
