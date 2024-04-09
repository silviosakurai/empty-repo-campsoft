import { phoneNumberIncludesCountryCode } from "@core/common/functions/phoneNumberIncludesCountryCode";
import { whatsappEnvironment } from "@core/config/environments";
import {
  IWhatsappService,
  IWhatsappServiceInput,
} from "@core/interfaces/services/IWhatsapp.service";
import { injectable } from "tsyringe";
import { MessageInstance } from "twilio/lib/rest/api/v2010/account/message";
import { LoggerService } from "@core/services/logger.service";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { ITemplateWhatsapp } from "@core/interfaces/repositories/tfa";
import { WhatsAppListerRepository } from "@core/repositories/whatsapp/WhatsAppLister.repository";
import { TemplateModulo } from "@core/common/enums/TemplateMessage";
import { IReplaceTemplate } from "@core/common/interfaces/IReplaceTemplate";
import { replaceTemplate } from "@core/common/functions/replaceTemplate";
import { NotificationTemplate } from "@core/interfaces/services/IClient.service";
import { extractPhoneNumber } from "@core/common/functions/extractPhoneNumber";
import { formatDateToString } from "@core/common/functions/formatDateToString";
import { Twilio } from "twilio";

@injectable()
export class WhatsappService implements IWhatsappService {
  constructor(
    private readonly logger: LoggerService,
    private readonly whatsAppListerRepository: WhatsAppListerRepository
  ) {}

  async send(input: IWhatsappServiceInput): Promise<MessageInstance> {
    const client = await this.connection();

    try {
      const sendPhone = this.sendPhone(input.sender_phone);
      const targetPhone = phoneNumberIncludesCountryCode(input.target_phone);

      const response = await client.messages.create({
        from: `whatsapp:${sendPhone}`,
        body: input.message,
        to: `whatsapp:${targetPhone}`,
      });

      return response;
    } catch (error: unknown) {
      this.logger.error(error);

      throw error;
    }
  }

  private async connection() {
    try {
      const accountSid = whatsappEnvironment.whatsappApiSid;
      const authToken = whatsappEnvironment.whatsappApiToken;

      const client = new Twilio(accountSid, authToken);
      return client;
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  private sendPhone(sendPhone: string | null | undefined): string {
    const phoneNumber = sendPhone ?? whatsappEnvironment.whatsappApiNumber;

    return phoneNumberIncludesCountryCode(phoneNumber);
  }

  public async getTemplateWhatsappModule(
    tokenKeyData: ITokenKeyData,
    templateModulo: TemplateModulo
  ): Promise<ITemplateWhatsapp | null> {
    return this.whatsAppListerRepository.getTemplateWhatsapp(
      tokenKeyData,
      templateModulo
    );
  }

  public async getTemplateWhatsapp(
    tokenKeyData: ITokenKeyData,
    templateModulo: TemplateModulo,
    rTemplate: IReplaceTemplate
  ): Promise<ITemplateWhatsapp | null> {
    const template = await this.getTemplateWhatsappModule(
      tokenKeyData,
      templateModulo
    );

    if (!template) {
      return null;
    }

    template.template = replaceTemplate(template.template, rTemplate);

    return template;
  }

  public async sendWhatsapp(
    tokenKeyData: ITokenKeyData,
    notificationTemplate: NotificationTemplate,
    templateModulo: TemplateModulo,
    rTemplate: IReplaceTemplate
  ): Promise<boolean> {
    const template = await this.getTemplateWhatsapp(
      tokenKeyData,
      templateModulo,
      rTemplate
    );

    if (!template) {
      return false;
    }

    const payload = {
      target_phone: notificationTemplate.phoneNumber,
      message: template.template,
    } as IWhatsappServiceInput;

    const sendWA = await this.send(payload);

    if (sendWA) {
      const sender = extractPhoneNumber(sendWA.from);
      const whatsappToken = sendWA.sid;
      const sendDate = formatDateToString(sendWA.dateCreated);

      await this.whatsAppListerRepository.insertWhatsAppHistory(
        template.templateId,
        notificationTemplate,
        sender,
        whatsappToken,
        sendDate
      );

      return true;
    }

    return false;
  }
}
