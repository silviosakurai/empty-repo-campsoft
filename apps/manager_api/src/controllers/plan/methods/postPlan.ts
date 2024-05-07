import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { PlanCreatorUseCase } from '@core/useCases/plan/PlanCreator.useCase';
import { container } from 'tsyringe';
import { CreatePlanRequest } from '@core/useCases/plan/dtos/CreatePlanRequest.dto';

export const postPlan = async (
  request: FastifyRequest<{
    Body: CreatePlanRequest;
  }>,
  reply: FastifyReply
) => {
  const planCreatorUseCase = container.resolve(PlanCreatorUseCase);
  const { t } = request;

  try {
    const response = await planCreatorUseCase.execute(request.body);

    if (!response) {
      request.server.logger.warn(response, request.id);

      return sendResponse(reply, {
        message: t('error_create_product'),
        httpStatusCode: HTTPStatusCode.NOT_FOUND,
      });
    }

    return sendResponse(reply, {
      data: request.body,
      httpStatusCode: HTTPStatusCode.OK,
    });
  } catch (error) {
    request.server.logger.error(error, request.id);

    return sendResponse(reply, {
      message: t('internal_server_error'),
      httpStatusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
