import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { ReviewsListerUseCase } from '@core/useCases/review/ReviewsLister.useCase';

export const listReviews = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { t, tokenKeyData } = request;
  const reviewUseCase = container.resolve(ReviewsListerUseCase);

  try {
    const response = await reviewUseCase.list(tokenKeyData);

    return sendResponse(reply, {
      httpStatusCode: HTTPStatusCode.OK,
      data: response,
    });
  } catch (error) {
    request.server.logger.error(error, request.id);

    return sendResponse(reply, {
      message: t('internal_server_error'),
      httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
