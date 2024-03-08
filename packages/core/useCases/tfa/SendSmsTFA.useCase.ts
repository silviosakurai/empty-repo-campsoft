import { TfaService } from "@core/services/tfa.service";
import { injectable } from "tsyringe";
import { SendCodeTFARequest } from "@core/useCases/tfa/dtos/SendCodeTFARequest.dto";
import { ViewApiResponse } from "@core/useCases/api/dtos/ViewApiResponse.dto";
import { ITemplateSMS } from "@core/interfaces/repositories/tfa";
import { TemplateMessageParams } from "@core/common/enums/TemplateMessageParams";
import { SmsService } from "@core/services/sms.service";
import { ISmsServiceSendInput } from "@core/interfaces/services/ISms.service";

@injectable()
export class SendSmsTFA {
  private tfaService: TfaService;
  private smsService: SmsService;

  constructor(tfaService: TfaService, smsService: SmsService) {
    this.tfaService = tfaService;
    this.smsService = smsService;
  }

  async execute({
    apiAccess,
    type,
    login,
  }: SendCodeTFARequest): Promise<boolean> {
    try {
      const code = await this.tfaService.generateAndVerifyToken();
      const { template, templateId } = await this.getTemplateSMS(
        apiAccess,
        code
      );

      const payload = {
        phone: login,
        message: template,
      } as ISmsServiceSendInput;

      const sendSms = await this.smsService.send(payload);

      if (sendSms) {
        await this.tfaService.insertSmsHistory(templateId, sendSms);
      }

      await this.tfaService.insertCodeUser(type, login, code);

      return true;
    } catch (error) {
      throw error;
    }
  }

  async getTemplateSMS(
    apiAccess: ViewApiResponse,
    code: string
  ): Promise<ITemplateSMS> {
    const template = await this.tfaService.getTemplateSms(apiAccess);

    template.template = template.template.replace(
      TemplateMessageParams.CODE,
      code
    );

    return template;
  }
}
