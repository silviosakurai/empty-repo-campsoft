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
      : await this.generateExternalId(t, client);

    const result =
      await this.paymentGatewayService.createTransactionSimpleTicket({
        amount: +order.total_price * 100,
        customerId: externalId,
        description: order.observation,
        reference_id: order.order_id,
        sellerId,
      });

    if (!result.data) {
      return result;
    }

    await this.orderService.paymentOrderUpdateByOrderId(order.order_id, {
      paymentTransactionId: result.data.id,
      paymentLink: result.data.payment_method.url,
      dueDate: result.data.payment_method.expiration_date,
      barcode: result.data.payment_method.barcode,
    });

    return result;
  }

  private async generateExternalId(
    t: TFunction<"translation", undefined>,
    client: ViewClientResponse
  ) {
    const address = await this.clientService.viewBilling(client.client_id);

    const clientWithAddress = {
      ...client,
      address,
    };

    await this.clientPaymentCreatorUseCase.create(t, clientWithAddress);

    const clientPayment = await this.clientService.viewPaymentClient(
      client.client_id
    );

    if (!clientPayment) {
      throw new Error(t("internal_server_error"));
    }

    return clientPayment.external_id;
  }
}
