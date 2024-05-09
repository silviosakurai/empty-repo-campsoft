import { ClientService } from "@core/services/client.service";
import { injectable } from "tsyringe";
import { PasswordRecoveryMethodsClientRequest } from "@core/useCases/client/dtos/PasswordRecoveryMethodsClientRequest.dto";
import { PasswordRecoveryMethodsClientResponse } from "@core/useCases/client/dtos/PasswordRecoveryMethodsClientResponse.dto";
import { TFAType } from "@core/common/enums/models/tfa";
import { obfuscateEmail } from "@core/common/functions/obfuscateEmail";
import { obfuscatePhone } from "@core/common/functions/obfuscatePhone";

@injectable()
export class ClientPasswordRecoveryMethodsUseCase {
  constructor(private readonly clientService: ClientService) {}

  async execute({
    login,
  }: PasswordRecoveryMethodsClientRequest): Promise<PasswordRecoveryMethodsClientResponse | null> {
    const recoveryMethods =
      await this.clientService.passwordRecoveryMethods(login);

    if (!recoveryMethods) {
      return null;
    }

    return {
      client_id: recoveryMethods.clientId,
      name: recoveryMethods.name,
      email: obfuscateEmail(recoveryMethods.email),
      phone: obfuscatePhone(recoveryMethods.phone),
      profile_image: recoveryMethods.profileImage,
      recovery_types: this.recoveryMethods(
        recoveryMethods.email,
        recoveryMethods.phone
      ),
    } as PasswordRecoveryMethodsClientResponse;
  }

  recoveryMethods(email: string, phone: string): TFAType[] {
    let recoveryMethods: TFAType[] = [];

    if (email) {
      recoveryMethods.push(TFAType.EMAIL);
    }

    if (phone) {
      recoveryMethods.push(TFAType.SMS);
      recoveryMethods.push(TFAType.WHATSAPP);
    }

    return recoveryMethods;
  }
}
