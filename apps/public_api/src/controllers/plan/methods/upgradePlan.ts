import { HTTPStatusCode } from '@core/common/enums/HTTPStatusCode';
import { sendResponse } from '@core/common/functions/sendResponse';
import { FastifyReply, FastifyRequest } from 'fastify';
import { UpgradeUseCase } from '@core/useCases/plan/UpgradePlan.useCase';
import { container } from 'tsyringe';
import { UpgradePlanRequest } from '@core/useCases/plan/dtos/UpgradePlanRequest.dto';

export const upgradePlan = async (
  request: FastifyRequest<{
    Querystring: UpgradePlanRequest;
  }>,
  reply: FastifyReply
) => {
  const upgradePlanUseCase = container.resolve(UpgradeUseCase);
  const { t, tokenKeyData, tokenJwtData } = request;

  const productIds = 
    request.query.products ? request.query.products.split(',') : [];
  
  try {
    const response = await upgradePlanUseCase.execute(
      tokenKeyData.company_id,
      tokenJwtData.clientId,
      productIds,
    );

    if (!response) {
      request.server.logger.info(response, request.id);

      return sendResponse(reply, {
        message: t('plans_not_found'),
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
    console.log('request.params:', request.params)
    console.log('request.params:', request.params)
    console.log('request.params:', request.params)
    console.log('request.params:', request.params)
    console.log('request.params:', request.params)
    console.log('request.params:', request.params)
    console.log('request.params:', request.params)
    console.log('request.params:', request.params)
};
