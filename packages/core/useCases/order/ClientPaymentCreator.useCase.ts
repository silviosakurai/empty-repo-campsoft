import { ClientService } from "@core/services";
import { PaymentGatewayService } from "@core/services/paymentGateway.service";
import { injectable } from "tsyringe";
import { ViewClientResponse } from "../client/dtos/ViewClientResponse.dto";
import { TFunction } from "i18next";

@injectable()
export class ClientPaymentCreatorUseCase {
  constructor(
    private readonly clientService: ClientService,
    private readonly paymentGatewayService: PaymentGatewayService
  ) {}

  async create(
    t: TFunction<"translation", undefined>,
    client: ViewClientResponse
  ) {
    const createdCustomer = await this.paymentGatewayService.createCustomer({
      firstName: client.first_name,
      lastName: client.last_name,
      cpf: client.cpf,
      phone: client.phone,
      birthDate: new Date(client.birthday),
      email: client.email,
    });

    if (!createdCustomer.data) {
      throw new Error(t("creation_customer_to_payment_failed"));
    }

    const clientPaymentCreated = await this.clientService.createPaymentClient(
      client.client_id,
      createdCustomer.data.id
    );

    return clientPaymentCreated;
  }
}
