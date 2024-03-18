import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ViewPlanUseCase } from '@core/useCases/plan/ViewPlan.useCase';
import { container } from 'tsyringe';
import { ViewPlanRequest } from '@core/useCases/plan/dtos/ViewPlanRequest.dto';

export const viewPlan = async (
  request: FastifyRequest<{
    Params: ViewPlanRequest;
  }>,
  reply: FastifyReply
) => {
  const viewPlanUseCase = container.resolve(ViewPlanUseCase);
  const { t, tokenKeyData } = request;

  try {
    const response = await viewPlanUseCase.execute(
      tokenKeyData.company_id,
      request.params.planId
    );

    if (!response) {
      request.server.logger.info(response, request.id);

      return sendResponse(reply, {
        message: t('product_not_found'),
        httpStatusCode: HTTPStatusCode.NOT_FOUND,
      });
    }

    return sendResponse(reply, {
      data: response,
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
