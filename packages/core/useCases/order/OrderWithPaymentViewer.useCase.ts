import { TFunction } from "i18next";
import { injectable } from "tsyringe";
import { ClientService, OrderService } from "@core/services";
import { PaymentService } from "@core/services/payment.service";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { ClientPaymentExternalGeneratorUseCase } from "../client/ClientPaymentExternalGenerator.useCase";

@injectable()
export class OrderWithPaymentReaderUseCase {
  constructor(
    private readonly orderService: OrderService,
    private readonly clientService: ClientService,
    private readonly paymentService: PaymentService,
    private readonly paymentExternalGeneratorUseCase: ClientPaymentExternalGeneratorUseCase
  ) {}

  async view(
    t: TFunction<"translation", undefined>,
    tokenKey: ITokenKeyData,
    orderId: string
  ) {
    const order = await this.orderService.listOrderById(orderId);

    if (!order) {
      throw new Error(t("order_not_found"));
    }

    const sellerId = order.seller_id
      ? order.seller_id
      : (
          await this.paymentService.sellerViewByEmail(
            "ricardo@maniadeapp.com.br"
          )
        )?.sellerId;

    if (!sellerId) {
      throw new Error(t("seller_not_found"));
    }

    const client = await this.clientService.view(tokenKey, order.client_id);

    if (!client) {
      throw new Error(t("client_not_found"));
    }

    const clientPayment = await this.clientService.viewPaymentClient(
      client.client_id
    );

    const externalId = clientPayment
      ? clientPayment.external_id
      : await this.paymentExternalGeneratorUseCase.generate(t, client);

    return { order, sellerId, externalId };
  }
}
