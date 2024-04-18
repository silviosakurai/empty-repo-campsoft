import PlanController from '@/controllers/plan';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import {
  getPlanByCompanySchema,
  listPlanByCompanySchema,
} from '@core/validations/plan';

export default async function planRoutes(server: FastifyInstance) {
  const planController = container.resolve(PlanController);

  server.get('/plans', {
    schema: listPlanByCompanySchema,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
    handler: planController.list,
  });

  server.get('/plans/:planId', {
    schema: getPlanByCompanySchema,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
    handler: planController.view,
  });
}
