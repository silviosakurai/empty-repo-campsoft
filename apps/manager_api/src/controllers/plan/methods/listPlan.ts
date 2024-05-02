import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { PlansListerByCompanyUseCase } from '@core/useCases/plan/PlansListerByCompany.useCase';
import { container } from 'tsyringe';
import { ListPlanRequest } from '@core/useCases/plan/dtos/ListPlanRequest.dto';

export const listPlan = async (
  request: FastifyRequest<{
    Querystring: ListPlanRequest;
  }>,
  reply: FastifyReply
) => {
  const planListerUseCase = container.resolve(PlansListerByCompanyUseCase);
  const { t, tokenJwtData } = request;

  try {
    const response = await planListerUseCase.execute(
      tokenJwtData,
      request.query,
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
