import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';

export const paymentWebhook = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  request.server.logger.trace(JSON.stringify(request), 'payment-webhook');

  console.log(request.body);
  console.log(request.params);
  console.log(request.query);

  return sendResponse(reply, {
    httpStatusCode: HTTPStatusCode.OK,
  });
};
