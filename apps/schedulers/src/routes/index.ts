import { SchedulersController } from '@/controller';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';

export default async function (server: FastifyInstance) {
  const controller = container.resolve(SchedulersController);

  await controller.handleQueue(server);
  await controller.handlePaymentRecurrenceDlq(server);
}
