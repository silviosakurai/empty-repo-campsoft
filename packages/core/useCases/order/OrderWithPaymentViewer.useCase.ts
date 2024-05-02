import { TFunction } from "i18next";
import { injectable } from "tsyringe";
import { ClientService, OrderService, SellerService } from "@core/services";
import { ClientPaymentExternalGeneratorUseCase } from "../client/ClientPaymentExternalGenerator.useCase";

@injectable()
export class OrderWithPaymentReaderUseCase {
  constructor(
    private readonly orderService: OrderService,
    private readonly sellerService: SellerService,
    private readonly clientService: ClientService,
    private readonly paymentExternalGeneratorUseCase: ClientPaymentExternalGeneratorUseCase
  ) {}

  async view(t: TFunction<"translation", undefined>, orderId: string) {
    const order = await this.orderService.listOrderById(orderId);

    if (!order) {
      throw new Error(t("order_not_found"));
    }

    const sellerId = order.seller_id
      ? order.seller_id
      : (await this.sellerService.viewByEmail("ricardo@maniadeapp.com.br"))
          ?.sellerId;

    if (!sellerId) {
      throw new Error(t("seller_not_found"));
    }

    const client = await this.clientService.view(order.client_id);

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
