import { TfaService } from "@core/services/tfa.service";
import { injectable } from "tsyringe";
import { SendCodeLoginTFARequest } from "@core/useCases/tfa/dtos/SendCodeTFARequest.dto";
import { ITemplateWhatsapp } from "@core/interfaces/repositories/tfa";
import { IWhatsappServiceInput } from "@core/interfaces/services/IWhatsapp.service";
import { WhatsappService } from "@core/services/whatsapp.service";
import { replaceTemplate } from "@core/common/functions/replaceTemplate";
import { IReplaceTemplate } from "@core/common/interfaces/IReplaceTemplate";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";

@injectable()
export class WhatsAppTFASenderUserCase {
  constructor(
    private readonly tfaService: TfaService,
    private readonly whatsappService: WhatsappService
  ) {}

  async execute({
    tokenKeyData,
    type,
    loginUserTFA,
  }: SendCodeLoginTFARequest): Promise<boolean> {
    const code = await this.tfaService.generateAndVerifyToken();
    const { template, templateId } = await this.getTemplateWhatsapp(
      tokenKeyData,
      code
    );

    const payload = {
      target_phone: loginUserTFA.login,
      message: template,
    } as IWhatsappServiceInput;

    const sendWA = await this.whatsappService.send(payload);

    if (sendWA) {
      await this.tfaService.insertWhatsAppHistory(
        templateId,
        loginUserTFA,
        sendWA
      );
    }

    await this.tfaService.insertCodeUser(type, loginUserTFA, code);

    return true;
  }

  async getTemplateWhatsapp(
    tokenKeyData: ITokenKeyData,
    code: string
  ): Promise<ITemplateWhatsapp> {
    const template = await this.tfaService.getTemplateWhatsapp(tokenKeyData);

    template.template = replaceTemplate(template.template, {
      code,
    } as IReplaceTemplate);

    return template;
  }
}
