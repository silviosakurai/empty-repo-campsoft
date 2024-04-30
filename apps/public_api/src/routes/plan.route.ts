import PlanController from '@/controllers/plan';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import {
  getPlanSchema,
  listPlanSchema,
  upgradePlanSchema,
} from '@core/validations/plan';
import {
  planViewPermissions,
  planUpgradesPermissions,
  planListPermissions,
} from '@/permissions';

export default async function planRoutes(server: FastifyInstance) {
  const planController = container.resolve(PlanController);

  server.get('/plans', {
    schema: listPlanSchema,
    handler: planController.list,
    preHandler: [
      (request, reply) =>
        server.authenticateKeyApi(request, reply, planListPermissions),
    ],
  });

  server.get('/plans/:planId', {
    schema: getPlanSchema,
    handler: planController.view,
    preHandler: [
      (request, reply) =>
        server.authenticateKeyApi(request, reply, planViewPermissions),
    ],
  });

  server.get('/plans/upgrades', {
    schema: upgradePlanSchema,
    handler: planController.upgrade,
    preHandler: [
      (request, reply) =>
        server.authenticateKeyApi(request, reply, planUpgradesPermissions),
      (request, reply) =>
        server.authenticateJwt(request, reply, planUpgradesPermissions),
    ],
  });
}
