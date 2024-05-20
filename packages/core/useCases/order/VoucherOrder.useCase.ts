import { injectable } from "tsyringe";
import { OrderService } from "@core/services/order.service";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { VoucherOrderRequestDto } from "@core/useCases/order/dtos/CreateOrderRequest.dto";
import { TFunction } from "i18next";
import { OrderByNumberCreateResponse } from "@core/interfaces/repositories/order";
import { ClientService } from "@core/services/client.service";
import { VoucherService } from "@core/services/voucher.service";
import { PaymentService } from "@core/services/payment.service";

@injectable()
export class VoucherOrderUseCase {
  constructor(
    private readonly orderService: OrderService,
    private readonly clientService: ClientService,
    private readonly voucherService: VoucherService,
    private readonly paymentService: PaymentService
  ) {}

  async execute(
    t: TFunction<"translation", undefined>,
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData,
    payload: VoucherOrderRequestDto
  ) {
    const userFounded = await this.clientService.view(tokenJwtData.clientId);

    if (!userFounded) {
      throw new Error(t("client_not_found"));
    }

    const planIdVoucher = await this.voucherService.getPlanVoucher(
      tokenKeyData.id_parceiro,
      payload.voucher
    );

    if (!planIdVoucher) {
      throw new Error(t("voucher_not_have_active_plans"));
    }

    const orderId = await this.orderService.createOrderByVoucher(
      tokenKeyData,
      tokenJwtData,
      payload,
      userFounded,
      planIdVoucher
    );

    if (!orderId) {
      throw new Error(t("error_create_order"));
    }

    const payWithVoucher = await this.paymentService.payWithVoucher(
      t,
      tokenKeyData,
      tokenJwtData,
      orderId,
      payload.voucher
    );

    if (!payWithVoucher) {
      throw new Error(t("error_pay_with_voucher"));
    }

    return this.viewOrderCreated(tokenKeyData, tokenJwtData, orderId);
  }

  async viewOrderCreated(
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData,
    orderId: string
  ): Promise<OrderByNumberCreateResponse | null> {
    const results = await this.orderService.viewOrderByNumberByCreate(
      orderId,
      tokenKeyData,
      tokenJwtData
    );

    if (!results) {
      return null;
    }

    return results;
  }
}
