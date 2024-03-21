import PlanController from '@/controllers/plan';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import {
  listPlanSchema,
  getPlan,
} from '@core/validations/plan/plan.validation';

export default async function planRoutes(server: FastifyInstance) {
  const planController = container.resolve(PlanController);

  server.get('/plans', {
    schema: listPlanSchema,
    preHandler: [server.authenticateKeyApi],
    handler: planController.list,
  });

  server.get('/plans/:planId', {
    schema: getPlan,
    preHandler: [server.authenticateKeyApi],
    handler: planController.view,
  });
}
