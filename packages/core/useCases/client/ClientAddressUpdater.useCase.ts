import { injectable } from "tsyringe";
import { ClientService } from "@core/services/client.service";
import {
  UpdateClientAddressBillingRequest,
  UpdateClientAddressShippingRequest,
} from "./dtos/UpdateClientAddressRequest.dto";
import {
  ClientAddress,
  ClientShippingAddress,
} from "@core/common/enums/models/client";

@injectable()
export class ClientAddressUpdaterUseCase {
  constructor(private readonly clientService: ClientService) {}

  async updateBilling(
    clientId: string,
    data: UpdateClientAddressBillingRequest
  ): Promise<boolean> {
    const addressExists = await this.clientService.viewBilling(clientId);

    if (!addressExists) {
      return this.clientService.createAddressBilling(clientId, data);
    }

    return this.clientService.updateAddressBilling(clientId, data);
  }

  async updateShipping(
    clientId: string,
    data: UpdateClientAddressShippingRequest
  ): Promise<boolean> {
    const addressExists = await this.clientService.viewShipping(clientId);

    if (!addressExists) {
      return this.clientService.createAddressShipping(clientId, data);
    }

    if (data.shipping_address) {
      return this.clientService.updateShippingAddress(
        clientId,
        ClientAddress.BILLING,
        ClientShippingAddress.YES
      );
    }

    return this.clientService.updateAddressShipping(clientId, data);
  }
}
