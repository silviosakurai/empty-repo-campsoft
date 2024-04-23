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
    handler: planController.list,
    preHandler: [
      (request, reply) => server.authenticateKeyApi(request, reply, null),
    ],
  });

  server.get('/plans/:planId', {
    schema: getPlanSchema,
    handler: planController.view,
    preHandler: [
      (request, reply) => server.authenticateKeyApi(request, reply, null),
    ],
  });

  server.get('/plans/upgrades', {
    schema: upgradePlanSchema,
    handler: planController.upgrade,
    preHandler: [
      (request, reply) => server.authenticateKeyApi(request, reply, null),
      (request, reply) => server.authenticateJwt(request, reply),
    ],
  });
}
