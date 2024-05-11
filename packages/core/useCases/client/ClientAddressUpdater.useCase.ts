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

  async addressExists(clientId: string, clientAddress: ClientAddress) {
    if (clientAddress === ClientAddress.BILLING) {
      return this.clientService.viewBilling(clientId);
    }

    return this.clientService.viewShippingExist(clientId);
  }

  async update(
    clientId: string,
    data: UpdateClientAddressRequest,
    clientAddress: ClientAddress
  ): Promise<boolean> {
    const addressExists = await this.addressExists(clientId, clientAddress);

    if (clientAddress === ClientAddress.SHIPPING) {
      await this.clientService.updateShippingAddress(
        clientId,
        ClientAddress.BILLING,
        ClientShippingAddress.NO
      );
    }

    if (!addressExists) {
      return this.clientService.createAddress(clientId, data, clientAddress);
    }

    return this.clientService.updateAddress(clientId, data, clientAddress);
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
