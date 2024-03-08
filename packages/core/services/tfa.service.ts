import { TfaCodesWhatsAppRepository } from "@core/repositories/tfa/TfaCodesWhatsApp.repository";
import { TfaCodesRepository } from "@core/repositories/tfa/TfaCodes.repository";
import { ViewApiResponse } from "@core/useCases/api/dtos/ViewApiResponse.dto";
import { injectable } from "tsyringe";
import { generateTokenTfa } from "@core/common/functions/generateTokenTfa";
import { TFAType } from "@core/common/enums/models/tfa";
import {
  ITemplateWhatsapp,
  IValidateCodeTFA,
} from "@core/interfaces/repositories/tfa";
import { extractPhoneNumber } from "@core/common/functions/extractPhoneNumber";
import { MessageInstance } from "twilio/lib/rest/api/v2010/account/message";
import { formatDateToString } from "@core/common/functions/formatDateToString";

@injectable()
export class TfaService {
  private tfaCodesRepository: TfaCodesRepository;
  private tfaCodesWhatsAppRepository: TfaCodesWhatsAppRepository;

  constructor(
    tfaCodesRepository: TfaCodesRepository,
    tfaCodesWhatsAppRepository: TfaCodesWhatsAppRepository
  ) {
    this.tfaCodesRepository = tfaCodesRepository;
    this.tfaCodesWhatsAppRepository = tfaCodesWhatsAppRepository;
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

  public async insertCodeUser(
    type: TFAType,
    login: string,
    code: string
  ): Promise<boolean> {
    return await this.tfaCodesWhatsAppRepository.insertCodeUser(
      type,
      login,
      code
    );
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

  async validateCode(
    login: string,
    code: string
  ): Promise<IValidateCodeTFA | null> {
    return await this.tfaCodesRepository.validateCode(login, code);
  }
}
