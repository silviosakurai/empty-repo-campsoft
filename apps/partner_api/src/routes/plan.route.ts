import PlanController from '@/controllers/plan';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import {
  getPlanByCompanySchema,
  listPlanByCompanySchema,
} from '@core/validations/plan';
import { planListPermissions, planViewPermissions } from '@/permissions';

export default async function planRoutes(server: FastifyInstance) {
  const planController = container.resolve(PlanController);

  server.get('/plans', {
    schema: listPlanByCompanySchema,
    handler: planController.list,
    preHandler: [
      (request, reply) =>
        server.authenticateJwt(request, reply, planListPermissions),
    ],
  });

  server.get('/plans/:planId', {
    schema: getPlanByCompanySchema,
    handler: planController.view,
    preHandler: [
      (request, reply) =>
        server.authenticateJwt(request, reply, planViewPermissions),
    ],
  });
}
