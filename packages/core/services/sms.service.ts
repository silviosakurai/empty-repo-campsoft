import { InvalidPhoneNumberError } from "@core/common/exceptions/InvalidPhoneNumberError";
import { PhoneNumberValidator } from "@core/common/functions/PhoneNumberValidator";
import { smsEnvironment } from "@core/config/environments";
import {
  ISmsSentMessageResponse,
  ISmsService,
  ISmsServiceGatewayResponse,
  ISmsServiceSendInput,
} from "@core/interfaces/services/ISms.service";
import axios from "axios";
import { injectable } from "tsyringe";

@injectable()
export class SmsService implements ISmsService {
  constructor(private readonly phoneNumberValidator: PhoneNumberValidator) {}

  async send(input: ISmsServiceSendInput) {
    try {
      this.phonesValidate(input);

      const response = await this.connection();

      const { data } = await axios.post<ISmsSentMessageResponse>(
        `${smsEnvironment.smsApiBaseUrl}/api/campanha/simples`,
        {
          produtoId: smsEnvironment.smsApiProdutoId,
          centroCustoId: smsEnvironment.smsApiCentralCustomId,
          telefones: input.phone,
          nome: input.name ?? "Mania de App",
          mensagemCampanha: input.message,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${response.access_token}`,
            "User-Agent": "Mania de App (API)",
          },
          timeout: 3000,
        }
      );

      return data;
    } catch (error: unknown) {
      throw new Error(error as string);
    }
  }

  private phonesValidate(
    input: ISmsServiceSendInput
  ): null | InvalidPhoneNumberError {
    const phoneValidated = this.phoneNumberValidator.validateNational(
      input.phone
    );

    if (phoneValidated) {
      throw new InvalidPhoneNumberError("Phone is not valid.");
    }

    return null;
  }

  private async connection() {
    try {
      const response = await axios.post<ISmsServiceGatewayResponse>(
        `${smsEnvironment.smsApiAuthUrl}/login`,
        {
          email: smsEnvironment.smsApiEmail,
          password: smsEnvironment.smsApiPassword,
        },
        {
          headers: {
            "User-Agent": "Mania de App (API)",
            "Cache-Control": "no-cache",
            "Content-Type": "application/json",
          },
          timeout: 3000,
        }
      );

      return response.data;
    } catch (error: unknown) {
      throw new Error(error as string);
    }
  }
}
