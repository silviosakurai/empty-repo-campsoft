import { IWhatsappServiceInput } from "@core/interfaces/services/IWhatsapp.service";
import { TfaCodesWhatsAppRepository } from "@core/repositories/tfa/TfaCodesWhatsApp.repository";
import { WhatsappService } from "@core/services/whatsapp.service";
import { ViewApiResponse } from "@core/useCases/api/dtos/ViewApiResponse.dto";
import { injectable } from "tsyringe";
import { generateTokenTfa } from "@core/common/functions/generateTokenTfa";
import { TFAType } from "@core/common/enums/models/tfa";
import { TemplateMessageParams } from "@core/common/enums/TemplateMessageParams";
import { ITemplateWhatsapp } from "@core/interfaces/repositories/tfa";
import { extractPhoneNumber } from "@core/common/functions/extractPhoneNumber";
import { MessageInstance } from "twilio/lib/rest/api/v2010/account/message";

@injectable()
export class TfaService {
  private tfaCodesWhatsAppRepository: TfaCodesWhatsAppRepository;
  private whatsappService: WhatsappService;

  constructor(
    tfaCodesWhatsAppRepository: TfaCodesWhatsAppRepository,
    whatsappService: WhatsappService
  ) {
    this.tfaCodesWhatsAppRepository = tfaCodesWhatsAppRepository;
    this.whatsappService = whatsappService;
  }

  sendWhatsApp = async (
    apiAccess: ViewApiResponse,
    type: TFAType,
    login: string
  ): Promise<boolean> => {
    try {
      const code = await this.generateAndVerifyToken();
      const { template, templateId } = await this.getTemplateWhatsapp(
        apiAccess,
        code
      );

      const payload = {
        target_phone: login,
        message: template,
      } as IWhatsappServiceInput;

      const sendWA = await this.whatsappService.send(payload);
      await this.tfaCodesWhatsAppRepository.insertCodeUser(type, login, code);

      if (sendWA) {
        await this.insertWhatsAppHistory(templateId, sendWA);
      }

      return true;
    } catch (error) {
      throw error;
    }
  };

  private async generateAndVerifyToken(): Promise<string> {
    let token;
    let isUnique = false;

    do {
      token = generateTokenTfa();

      isUnique =
        await this.tfaCodesWhatsAppRepository.isTokenUniqueAndValid(token);
    } while (!isUnique);

    return token;
  }

  private async getTemplateWhatsapp(
    apiAccess: ViewApiResponse,
    code: string
  ): Promise<ITemplateWhatsapp> {
    const template =
      await this.tfaCodesWhatsAppRepository.getTemplateWhatsapp(apiAccess);

    template.template = template.template.replace(
      TemplateMessageParams.CODE,
      code
    );

    return template;
  }

  private async insertWhatsAppHistory(
    templateId: number,
    sendWA: MessageInstance
  ): Promise<boolean> {
    const sender = extractPhoneNumber(sendWA.from);
    const recipient = extractPhoneNumber(sendWA.to);
    const whatsappToken = sendWA.sid;
    const sendDate = new Date(sendWA.dateCreated);

    return await this.tfaCodesWhatsAppRepository.insertWhatsAppHistory(
      templateId,
      sender,
      recipient,
      whatsappToken,
      sendDate
    );
  }
}
