import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { WebSocket } from 'ws';

export const paymentWebhook = async (
  socket: WebSocket,
  request: FastifyRequest
) => {
  console.log(request.body);
  console.log(request.params);
  console.log(request.query);

  socket.on('message', (message) => {
    // message.toString() === 'hi from client'
    socket.send('hi from wildcard route');
  });

  // return sendResponse(reply, {
  //   httpStatusCode: HTTPStatusCode.OK,
  // });
};
