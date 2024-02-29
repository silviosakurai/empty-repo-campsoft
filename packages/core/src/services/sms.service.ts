import { Environments } from "../config/Environments";
import {
  ISmsSentMessageResponse,
  ISmsService,
  ISmsServiceGatewayResponse,
  ISmsServiceSendInput,
} from "@core/interfaces/services/ISms.service";
import axios from "axios";

export class SmsService implements ISmsService {
  async send(input: ISmsServiceSendInput) {
    const regexPhoneNumberAndDDD = /^\d{11}$/;

    if (!regexPhoneNumberAndDDD.test(input.phone)) {
      return new Error("Telefone inválido, seguir o padrão 99999999999");
    }

    const response = await this.connection();

    if (response instanceof Error) {
      return response;
    }

    try {
      const { data } = await axios.post<ISmsSentMessageResponse>(
        `${Environments.SMS_API_BASE_URL}/api/campanha/simples`,
        {
          produtoId: Environments.SMS_API_PRODUTO_ID,
          centroCustoId: Environments.SMS_API_CENTRAL_CUSTOM_ID,
          telefones: input.phone,
          nome: input.name,
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
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  private async connection() {
    try {
      const response = await axios.post<ISmsServiceGatewayResponse>(
        `${Environments.SMS_API_AUTH_URL}/login"`,
        {
          email: Environments.SMS_API_EMAIL,
          password: Environments.SMS_API_PASSWORD,
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
    } catch (error: any) {
      return Error(
        `${error.response.status} - ${error.response.data.message} - ${error.response.data.code}`
      );
    }
  }
}
