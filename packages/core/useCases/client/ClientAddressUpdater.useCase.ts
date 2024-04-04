import { injectable } from "tsyringe";
import { ClientService } from "@core/services/client.service";
import { ViewClientAddressDTO } from "./dtos/ViewClientAddressResponse.dto";
import { UpdateClientAddressRequest } from "./dtos/UpdateClientAddressRequest.dto";
import { ClientAddress, ClientShippingAddress } from "@core/common/enums/models/client";

@injectable()
export class ClientAddressUpdaterUseCase {
  constructor(private readonly clientService: ClientService) {}

  async updateBilling(clientId: string, data: UpdateClientAddressRequest): Promise<void> {
    const addressExists = await this.checkIfAddressExists(clientId, ClientAddress.BILLING);

    if (!addressExists) {
      await this.clientService.createAddress(clientId, ClientAddress.BILLING, data);
    }

    await this.clientService.updateAddress(clientId, data);
  }

  async updateShipping(clientId: string, data: UpdateClientAddressRequest): Promise<void> {
    const addressExists = await this.checkIfAddressExists(clientId, ClientAddress.SHIPPING);

    if (!addressExists) {
      await this.clientService.createAddress(clientId, ClientAddress.SHIPPING, data);
    }

    if (data.shipping_address) {
      await this.clientService.updateShippingAddress(clientId, ClientAddress.BILLING, ClientShippingAddress.YES);
    }

    await this.clientService.updateAddress(clientId, data);
  }

  async checkIfAddressExists(clientId: string, type: ClientAddress): Promise<ViewClientAddressDTO | null> {
    return this.clientService.viewAddress(clientId, type);
  }
}
