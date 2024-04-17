import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { ClientService, OrderService } from "@core/services";
import { PaymentService } from "@core/services/payment.service";
import { PaymentGatewayService } from "@core/services/paymentGateway.service";
import { TFunction } from "i18next";
import { injectable } from "tsyringe";

@injectable()
export class PayerByBoletoByOrderIdUseCase {
  constructor(
    private readonly orderService: OrderService,
    private readonly clientService: ClientService,
    private readonly paymentService: PaymentService,
    private readonly paymentGatewayService: PaymentGatewayService
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

    const createdCustomer = await this.paymentGatewayService.createCustomer({
      firstName: client.first_name,
      lastName: client.last_name,
      cpf: client.cpf,
      phone: client.phone,
      birthDate: new Date(client.birthday),
      email: client.email,
    });

    console.log(sellerId);
    console.log(createdCustomer);

    return createdCustomer;
  }
}
