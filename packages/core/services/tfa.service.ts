import { TfaCodesWhatsAppRepository } from "@core/repositories/tfa/TfaCodesWhatsApp.repository";
import { TfaCodesSms } from "@core/repositories/tfa/TfaCodesSms.repository";
import { TfaCodesRepository } from "@core/repositories/tfa/TfaCodes.repository";
import { injectable } from "tsyringe";
import { generateTokenTfa } from "@core/common/functions/generateTokenTfa";
import { TFAType } from "@core/common/enums/models/tfa";
import {
  ITemplateSMS,
  IValidateCodeTFA,
} from "@core/interfaces/repositories/tfa";
import { ISmsSentMessageResponse } from "@core/interfaces/services/ISms.service";
import { currentTime } from "@core/common/functions/currentTime";
import { LoginUserTFA } from "@core/interfaces/services/IClient.service";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";

@injectable()
export class TfaService {
  constructor(
    private readonly tfaCodesRepository: TfaCodesRepository,
    private readonly tfaCodesWhatsAppRepository: TfaCodesWhatsAppRepository,
    private readonly tfaCodesSms: TfaCodesSms
  ) {}

  async generateAndVerifyToken(): Promise<string> {
    let token;
    let isUnique = false;

    do {
      token = generateTokenTfa();

      isUnique =
        await this.tfaCodesWhatsAppRepository.isTokenUniqueAndValid(token);
    } while (!isUnique);

    return token;
  }

  public async getTemplateSms(
    tokenKeyData: ITokenKeyData
  ): Promise<ITemplateSMS> {
    return this.tfaCodesSms.getTemplateSms(tokenKeyData);
  }

  public async insertCodeUser(
    type: TFAType,
    loginUserTFA: LoginUserTFA,
    code: string
  ): Promise<boolean> {
    return this.tfaCodesRepository.insertCodeUser(type, loginUserTFA, code);
  }

  async insertSmsHistory(
    templateId: number,
    loginUserTFA: LoginUserTFA,
    sendSms: ISmsSentMessageResponse
  ): Promise<boolean> {
    const smsToken = sendSms.smsEnvios[0].smsId;
    const sendDate = currentTime();

    return this.tfaCodesSms.insertSmsHistory(
      templateId,
      loginUserTFA,
      smsToken,
      sendDate
    );
  }

  async validateCode(
    login: string,
    code: string,
    isUuidValid: boolean
  ): Promise<IValidateCodeTFA | null> {
    return this.tfaCodesRepository.validateCode(login, code, isUuidValid);
  }
}
