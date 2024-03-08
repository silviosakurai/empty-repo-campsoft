import { TfaCodesWhatsAppRepository } from "@core/repositories/tfa/TfaCodesWhatsApp.repository";
import { TfaCodesSms } from "@core/repositories/tfa/TfaCodesSms.repository";
import { TfaCodesRepository } from "@core/repositories/tfa/TfaCodes.repository";
import { ViewApiResponse } from "@core/useCases/api/dtos/ViewApiResponse.dto";
import { injectable } from "tsyringe";
import { generateTokenTfa } from "@core/common/functions/generateTokenTfa";
import { TFAType } from "@core/common/enums/models/tfa";
import {
  ITemplateSMS,
  ITemplateWhatsapp,
  IValidateCodeTFA,
} from "@core/interfaces/repositories/tfa";
import { extractPhoneNumber } from "@core/common/functions/extractPhoneNumber";
import { MessageInstance } from "twilio/lib/rest/api/v2010/account/message";
import { formatDateToString } from "@core/common/functions/formatDateToString";
import { ISmsSentMessageResponse } from "@core/interfaces/services/ISms.service";
import { currentTime } from "@core/common/functions/currentTime";

@injectable()
export class TfaService {
  private tfaCodesRepository: TfaCodesRepository;
  private tfaCodesWhatsAppRepository: TfaCodesWhatsAppRepository;
  private tfaCodesSms: TfaCodesSms;

  constructor(
    tfaCodesRepository: TfaCodesRepository,
    tfaCodesWhatsAppRepository: TfaCodesWhatsAppRepository,
    tfaCodesSms: TfaCodesSms
  ) {
    this.tfaCodesRepository = tfaCodesRepository;
    this.tfaCodesWhatsAppRepository = tfaCodesWhatsAppRepository;
    this.tfaCodesSms = tfaCodesSms;
  }

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

  public async getTemplateWhatsapp(
    apiAccess: ViewApiResponse
  ): Promise<ITemplateWhatsapp> {
    return await this.tfaCodesWhatsAppRepository.getTemplateWhatsapp(apiAccess);
  }

  public async getTemplateSms(
    apiAccess: ViewApiResponse
  ): Promise<ITemplateSMS> {
    return await this.tfaCodesSms.getTemplateSms(apiAccess);
  }

  public async insertCodeUser(
    type: TFAType,
    login: string,
    code: string
  ): Promise<boolean> {
    return await this.tfaCodesRepository.insertCodeUser(type, login, code);
  }

  async insertWhatsAppHistory(
    templateId: number,
    sendWA: MessageInstance
  ): Promise<boolean> {
    const sender = extractPhoneNumber(sendWA.from);
    const recipient = extractPhoneNumber(sendWA.to);
    const whatsappToken = sendWA.sid;
    const sendDate = formatDateToString(sendWA.dateCreated);

    return await this.tfaCodesWhatsAppRepository.insertWhatsAppHistory(
      templateId,
      sender,
      recipient,
      whatsappToken,
      sendDate
    );
  }

  async insertSmsHistory(
    templateId: number,
    sendSms: ISmsSentMessageResponse
  ): Promise<boolean> {
    const recipient = sendSms.smsEnvios[0].numero;
    const smsToken = sendSms.smsEnvios[0].smsId;
    const sendDate = currentTime();

    return await this.tfaCodesSms.insertSmsHistory(
      templateId,
      recipient,
      smsToken,
      sendDate
    );
  }

  async validateCode(
    login: string,
    code: string
  ): Promise<IValidateCodeTFA | null> {
    return await this.tfaCodesRepository.validateCode(login, code);
  }
}
