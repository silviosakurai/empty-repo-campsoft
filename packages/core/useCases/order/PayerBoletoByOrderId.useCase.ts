import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { ClientService, OrderService } from "@core/services";
import { PaymentService } from "@core/services/payment.service";
import { PaymentGatewayService } from "@core/services/paymentGateway.service";
import { TFunction } from "i18next";
import { injectable } from "tsyringe";
import { ClientPaymentCreatorUseCase } from "./ClientPaymentCreator.useCase";
import { ViewClientResponse } from "../client/dtos/ViewClientResponse.dto";

@injectable()
export class PayerByBoletoByOrderIdUseCase {
  constructor(
    private readonly orderService: OrderService,
    private readonly clientService: ClientService,
    private readonly paymentService: PaymentService,
    private readonly paymentGatewayService: PaymentGatewayService,
    private readonly clientPaymentCreatorUseCase: ClientPaymentCreatorUseCase
  ) {}

  async pay(
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
      : await this.paymentService.sellerViewByEmail(
          "ricardo@maniadeapp.com.br"
        );

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
      : await this.generateExternalId(t, client);

    // await this.paymentGatewayService.createTransactionFullTicket;
  }

  private async generateExternalId(
    t: TFunction<"translation", undefined>,
    client: ViewClientResponse
  ) {
    await this.clientPaymentCreatorUseCase.create(t, client);

    const clientPayment = await this.clientService.viewPaymentClient(
      client.client_id
    );

    if (!clientPayment) {
      throw new Error(t("internal_server_error"));
    }

    return clientPayment.external_id;
  }
}
