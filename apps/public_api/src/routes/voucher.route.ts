import VoucherController from '@/controllers/voucher';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import { voucherSchema } from '@core/validations/voucher/voucher.validation';

export default async function vouchersRoutes(server: FastifyInstance) {
  const voucherController = container.resolve(VoucherController);

  server.get('/vouchers/:voucherCode', {
    schema: voucherSchema,
    preHandler: [server.authenticateKeyApi, server.authenticateJwt],
    handler: voucherController.view,
  });
}
