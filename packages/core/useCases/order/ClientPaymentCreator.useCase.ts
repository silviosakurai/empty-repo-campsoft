import { PaymentGatewayService } from "@core/services/paymentGateway.service";
import { injectable } from "tsyringe";
import { ViewClientResponse } from "../client/dtos/ViewClientResponse.dto";
import { TFunction } from "i18next";
import { ViewClientBillingAddressResponse } from "../client/dtos/ViewClientAddressResponse.dto";
import { formatOnlyDateToString } from "@core/common/functions/formatOnlyDateToString";
import { ClientService } from "@core/services/client.service";

@injectable()
export class ClientPaymentCreatorUseCase {
  constructor(
    private readonly clientService: ClientService,
    private readonly paymentGatewayService: PaymentGatewayService
  ) {}

  async create(
    t: TFunction<"translation", undefined>,
    client: ViewClientResponse & {
      address: ViewClientBillingAddressResponse | null;
    }
  ) {
    const createdCustomer = await this.paymentGatewayService.createCustomer({
      first_name: client.first_name,
      last_name: client.last_name,
      taxpayer_id: client.cpf,
      phone_number: client.phone,
      birthdate: formatOnlyDateToString(new Date(client.birthday)),
      email: client.email,
      address: {
        line1: client.address?.street,
        line2: client.address?.number,
        line3: client.address?.complement,
        neighborhood: client.address?.neighborhood,
        city: client.address?.city,
        country_code: "BR",
        postal_code: client.address?.zip_code,
        state: client.address?.state ?? "",
      },
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
