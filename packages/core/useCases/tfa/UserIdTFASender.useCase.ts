import { ClientService } from "@core/services/client.service";
import { injectable } from "tsyringe";
import { SendCodeTFARequest } from "@core/useCases/tfa/dtos/SendCodeTFARequest.dto";
import { TFAType } from "@core/common/enums/models/tfa";

@injectable()
export class UserIdTFASenderUserCase {
  constructor(private readonly clientService: ClientService) {}

  async execute({
    type,
    login,
  }: SendCodeTFARequest): Promise<SendCodeTFARequest | null> {
    const viewClient = await this.clientService.view(login);

    if (!viewClient) {
      return null;
    }

    const loginUserId = this.getLoginUserId(type, viewClient);

    if (!loginUserId) {
      return null;
    }

    return {
      type,
      login: loginUserId,
    } as SendCodeTFARequest;
  }

  async findClientByEmailPhone(login: string): Promise<string | null> {
    const findUserId = await this.clientService.viewClientByEmailPhone({
      email: login,
      phone: login,
    });

    if (!findUserId) {
      return null;
    }

    return findUserId.id_cliente;
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
