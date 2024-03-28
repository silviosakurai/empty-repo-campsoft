import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';

export const viewHealth = async (
  _request: FastifyRequest,
  reply: FastifyReply
) => {
  return sendResponse(reply, {
    httpStatusCode: HTTPStatusCode.OK,
  });
};
