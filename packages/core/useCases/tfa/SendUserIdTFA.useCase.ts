import { ClientService } from "@core/services/client.service";
import { injectable } from "tsyringe";
import { SendCodeTFARequest } from "@core/useCases/tfa/dtos/SendCodeTFARequest.dto";
import { TFAType } from "@core/common/enums/models/tfa";

@injectable()
export class SendUserIdTFAUserCase {
  constructor(private clientService: ClientService) {}

  async execute({
    apiAccess,
    type,
    login,
  }: SendCodeTFARequest): Promise<SendCodeTFARequest | null> {
    try {
      const viewClient = await this.clientService.viewClient(apiAccess, login);

      if (!viewClient) {
        return null;
      }

      const loginUserId = this.getLoginUserId(type, viewClient);

      if (!loginUserId) {
        return null;
      }

      return {
        apiAccess,
        type,
        login: loginUserId,
      } as SendCodeTFARequest;
    } catch (error) {
      throw error;
    }
  }

  private getLoginUserId(
    type: TFAType,
    viewClient: { email?: string; phone?: string }
  ): string | null {
    if (type === TFAType.EMAIL && viewClient.email) {
      return viewClient.email;
    }

    if (
      (type === TFAType.SMS || type === TFAType.WHATSAPP) &&
      viewClient.phone
    ) {
      return viewClient.phone;
    }

    return null;
  }
}
