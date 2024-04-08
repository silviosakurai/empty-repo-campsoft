import PlanController from '@/controllers/plan';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import {
  getPlanSchema,
  listPlanSchema,
  upgradePlanSchema,
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

  server.get('/plans/upgrades', {
    schema: upgradePlanSchema,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
    handler: planController.upgrade,
  });
}
