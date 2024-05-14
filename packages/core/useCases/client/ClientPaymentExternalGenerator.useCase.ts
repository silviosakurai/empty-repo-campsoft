import { injectable } from "tsyringe";
import { ClientPaymentCreatorUseCase } from "../order/ClientPaymentCreator.useCase";
import { TFunction } from "i18next";
import { ViewClientResponse } from "./dtos/ViewClientResponse.dto";
import { ClientService } from "@core/services/client.service";

@injectable()
export class ClientPaymentExternalGeneratorUseCase {
  constructor(
    private readonly clientService: ClientService,
    private readonly clientPaymentCreatorUseCase: ClientPaymentCreatorUseCase
  ) {}

  async generate(
    t: TFunction<"translation", undefined>,
    client: ViewClientResponse
  ) {
    const address = await this.clientService.viewBilling(client.client_id);

    if (!address) {
      throw new Error(t("billing_address_not_found"));
    }

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
