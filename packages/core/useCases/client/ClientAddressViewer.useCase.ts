import { injectable } from "tsyringe";
import { ClientService } from "@core/services/client.service";
import { ClientAddress, ClientShippingAddress } from "@core/common/enums/models/client";
import { ViewClientBaseAddressResponse, ViewClientBillingAddressResponse } from "./dtos/ViewClientAddressResponse.dto";

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
      shipping_address: response.shipping_address === ClientShippingAddress.YES,
    }
  }

  async viewShipping(clientId: string): Promise<ViewClientBaseAddressResponse | null> {
    const billingResponse = await this.clientService.viewAddress(clientId, ClientAddress.BILLING);

    if (!billingResponse) {
      return null;
    }
    
    const billingIsShipping = billingResponse.shipping_address === ClientShippingAddress.YES;

    if (billingIsShipping) {
      const { shipping_address, ...billingWithoutShipping } = billingResponse;
      return billingWithoutShipping;
    }

    const shippingResponse = await this.clientService.viewAddress(clientId, ClientAddress.SHIPPING);

    if (!shippingResponse) {
      return null;
    }

    const { shipping_address, ...shippingWithoutShipping } = shippingResponse;

    return shippingWithoutShipping;
  }
}
