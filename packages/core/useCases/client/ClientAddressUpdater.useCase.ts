import { injectable } from "tsyringe";
import { ClientService } from "@core/services/client.service";
import {
  PatchClientAddressResponse,
  UpdateClientAddressRequest,
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
    data: UpdateClientAddressRequest
  ): Promise<boolean> {
    const addressExists = await this.clientService.viewBilling(clientId);

    if (!addressExists) {
      return this.clientService.createAddressBilling(clientId, data);
    }

    return this.clientService.updateAddressBilling(clientId, data);
  }

  async updateShipping(
    clientId: string,
    data: UpdateClientAddressRequest
  ): Promise<boolean> {
    const addressExists = await this.clientService.viewShipping(clientId);

    if (!addressExists) {
      return this.clientService.createAddressShipping(clientId, data);
    }

    return this.clientService.updateAddressShipping(clientId, data);
  }

  async updateShippingAddress(
    clientId: string,
    data: PatchClientAddressResponse
  ): Promise<boolean> {
    const shippingAddress = data.shipping_address
      ? ClientShippingAddress.YES
      : ClientShippingAddress.NO;

    return this.clientService.updateShippingAddress(
      clientId,
      ClientAddress.BILLING,
      shippingAddress
    );
  }
}
