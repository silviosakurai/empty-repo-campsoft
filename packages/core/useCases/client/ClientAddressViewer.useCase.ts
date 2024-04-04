import { injectable } from "tsyringe";
import { ClientService } from "@core/services/client.service";
import { ClientAddress, ClientShippingAddress } from "@core/common/enums/models/client";
import { ViewClientAddressDTO, ViewClientBillingAddressResponse } from "./dtos/ViewClientAddressResponse.dto";

@injectable()
export class ClientAddressViewerUseCase {
  constructor(private readonly clientService: ClientService) {}

  async viewBilling(clientId: string): Promise<ViewClientBillingAddressResponse | null> {
    const response = await this.clientService.viewAddress(clientId, ClientAddress.BILLING);

    if (!response) {
      return null;
    }

    return {
      ...response,
      shipping_address: response.shipping_address_enum === ClientShippingAddress.YES,
    }
  }

  async viewShipping(clientId: string): Promise<ViewClientAddressDTO | null> {
    const billingResponse = await this.clientService.viewAddress(clientId, ClientAddress.BILLING);

    if (!billingResponse) {
      return null;
    }
    
    const billingIsShipping = billingResponse.shipping_address_enum === ClientShippingAddress.YES;

    if (billingIsShipping) {
      return billingResponse;
    }

    const shippingResponse = await this.clientService.viewAddress(clientId, ClientAddress.SHIPPING);

    if (!shippingResponse) {
      return null;
    }

    return shippingResponse;
  }
}
