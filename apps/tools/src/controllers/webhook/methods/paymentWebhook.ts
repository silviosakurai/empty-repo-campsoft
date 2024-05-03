import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import WebSocket from 'ws';
import { PaymentWebhookHandlerUseCase } from '@core/useCases/webhook/PaymentWebhookHandler.useCase';

export const paymentWebhook = async (
  request: FastifyRequest,
  reply: FastifyReply,
  socket: WebSocket.Server
) => {
  const service = container.resolve(PaymentWebhookHandlerUseCase);

  request.server.logger.trace(JSON.stringify(request.body), 'payment-webhook');
  request.server.logger.trace(
    JSON.stringify(request.params),
    'payment-webhook'
  );
  request.server.logger.trace(JSON.stringify(request.query), 'payment-webhook');

  socket.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(`event.event - ${request.body}`);
    }
  });

  console.log(request.body);
  console.log(request.params);
  console.log(request.query);

  return sendResponse(reply, {
    httpStatusCode: HTTPStatusCode.OK,
  });
};
