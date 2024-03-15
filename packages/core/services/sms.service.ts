import { InvalidPhoneNumberError } from "@core/common/exceptions/InvalidPhoneNumberError";
import { smsEnvironment } from "@core/config/environments";
import {
  ISmsSentMessageResponse,
  ISmsService,
  ISmsServiceGatewayResponse,
  ISmsServiceSendInput,
} from "@core/interfaces/services/ISms.service";
import axios from "axios";
import { injectable } from "tsyringe";
import { LoggerService } from "@core/services/logger.service";
import { phoneNumberValidateNational } from "@core/common/functions/phoneNumberValidateNational";

@injectable()
export class SmsService implements ISmsService {
  private logger: LoggerService;

  constructor(logger: LoggerService) {
    this.logger = logger;
  }

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
      this.logger.error(error);

      throw error;
    }
  }

  private phonesValidate(
    input: ISmsServiceSendInput
  ): null | InvalidPhoneNumberError {
    const phoneValidated = phoneNumberValidateNational(input.phone);

    if (phoneValidated) {
      this.logger.warn({
        message: "Phone is not valid.",
        phone: input.phone,
      });

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
      this.logger.error(error);

      throw error;
    }
  }
}
