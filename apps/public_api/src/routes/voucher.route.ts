import VoucherController from '@/controllers/voucher';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import { geVoucherSchema } from '@core/validations/voucher';

export default async function vouchersRoutes(server: FastifyInstance) {
  const voucherController = container.resolve(VoucherController);

  server.get('/vouchers/:voucherCode', {
    schema: geVoucherSchema,
    preHandler: [server.authenticateKeyApi],
    handler: voucherController.view,
  });
}
