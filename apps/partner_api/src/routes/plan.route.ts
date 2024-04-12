import PlanController from '@/controllers/plan';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import {
  getPlanSchema,
  listPlanSchema,
} from '@core/validations/plan';

export default async function planRoutes(server: FastifyInstance) {
  const planController = container.resolve(PlanController);

  server.get('/plans', {
    schema: listPlanSchema,
    preHandler: [server.authenticateKeyApi],
    handler: planController.list,
  });

  server.get('/plans/:planId', {
    schema: getPlanSchema,
    preHandler: [server.authenticateKeyApi],
    handler: planController.view,
  });
}
