import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { ClientService, OrderService } from "@core/services";
import { PaymentService } from "@core/services/payment.service";
import { PaymentGatewayService } from "@core/services/paymentGateway.service";
import { TFunction } from "i18next";
import { injectable } from "tsyringe";
import { ClientPaymentExternalGeneratorUseCase } from "../client/ClientPaymentExternalGenerator.useCase";
import { ResponseService } from "@core/common/interfaces/IResponseServices";

@injectable()
export class PayerByBoletoByOrderIdUseCase {
  constructor(
    private readonly orderService: OrderService,
    private readonly clientService: ClientService,
    private readonly paymentService: PaymentService,
    private readonly paymentGatewayService: PaymentGatewayService,
    private readonly paymentExternalGeneratorUseCase: ClientPaymentExternalGeneratorUseCase
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
      : await this.paymentExternalGeneratorUseCase.generate(t, client);

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

    return {
      data: {
        url: result.data.payment_method.url,
        code: result.data.payment_method.barcode,
      },
      status: true,
    } as ResponseService;
  }
}
