import { TfaService } from "@core/services/tfa.service";
import { injectable } from "tsyringe";
import { SendCodeTFARequest } from "@core/useCases/tfa/dtos/SendCodeTFARequest.dto";
import { ViewApiResponse } from "@core/useCases/api/dtos/ViewApiResponse.dto";
import { ITemplateWhatsapp } from "@core/interfaces/repositories/tfa";
import { IWhatsappServiceInput } from "@core/interfaces/services/IWhatsapp.service";
import { WhatsappService } from "@core/services/whatsapp.service";
import { replaceTemplate } from "@core/common/functions/replaceTemplate";
import { IReplaceTemplate } from "@core/common/interfaces/IReplaceTemplate";

@injectable()
export class SendWhatsAppTFAUserCase {
  private tfaService: TfaService;
  private whatsappService: WhatsappService;

  constructor(tfaService: TfaService, whatsappService: WhatsappService) {
    this.tfaService = tfaService;
    this.whatsappService = whatsappService;
  }

  async execute({
    apiAccess,
    type,
    login,
  }: SendCodeTFARequest): Promise<boolean> {
    try {
      const code = await this.tfaService.generateAndVerifyToken();
      const { template, templateId } = await this.getTemplateWhatsapp(
        apiAccess,
        code
      );

      const payload = {
        target_phone: login,
        message: template,
      } as IWhatsappServiceInput;

      const sendWA = await this.whatsappService.send(payload);

      if (sendWA) {
        await this.tfaService.insertWhatsAppHistory(templateId, sendWA);
      }

      await this.tfaService.insertCodeUser(type, login, code);

      return true;
    } catch (error) {
      throw error;
    }
  }

  async getTemplateWhatsapp(
    apiAccess: ViewApiResponse,
    code: string
  ): Promise<ITemplateWhatsapp> {
    const template = await this.tfaService.getTemplateWhatsapp(apiAccess);

    template.template = replaceTemplate(template.template, {
      code,
    } as IReplaceTemplate);

    return template;
  }
}
