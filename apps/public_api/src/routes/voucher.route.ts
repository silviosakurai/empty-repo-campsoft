import VoucherController from '@/controllers/voucher';
import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';
import { getVoucherSchema } from '@core/validations/voucher';
import { voucherViewPermissions } from '@/permissions';

export default async function vouchersRoutes(server: FastifyInstance) {
  const voucherController = container.resolve(VoucherController);

  server.get('/vouchers/:voucherCode', {
    schema: getVoucherSchema,
    handler: voucherController.view,
    preHandler: [
      (request, reply) =>
        server.authenticateKeyApi(request, reply, voucherViewPermissions),
    ],
  });
}
