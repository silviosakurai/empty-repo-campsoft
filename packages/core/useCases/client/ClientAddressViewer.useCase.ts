import { injectable } from "tsyringe";
import { ClientService } from "@core/services/client.service";
import {
  ViewClientBillingAddressResponse,
  ViewClientShippingAddressResponse,
} from "./dtos/ViewClientAddressResponse.dto";

@injectable()
export class ClientAddressViewerUseCase {
  constructor(private readonly clientService: ClientService) {}

  async viewBilling(
    clientId: string
  ): Promise<ViewClientBillingAddressResponse | null> {
    return this.clientService.viewBilling(clientId);
  }

  async viewShipping(
    clientId: string
  ): Promise<ViewClientShippingAddressResponse | null> {
    return this.clientService.viewShipping(clientId);
  }
}
