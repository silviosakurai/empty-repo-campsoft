import { TfaService } from "@core/services/tfa.service";
import { injectable } from "tsyringe";
import { SendCodeLoginTFARequest } from "@core/useCases/tfa/dtos/SendCodeTFARequest.dto";
import { WhatsappService } from "@core/services/whatsapp.service";
import { NotificationTemplate } from "@core/interfaces/services/IClient.service";
import { IReplaceTemplate } from "@core/common/interfaces/IReplaceTemplate";
import { TemplateModulo } from "@core/common/enums/TemplateMessage";

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
    const notificationTemplate = {
      phoneNumber: loginUserTFA.login,
      clientId: loginUserTFA.clientId,
    } as NotificationTemplate;

    const replaceTemplate = {
      code,
    } as IReplaceTemplate;

    await this.whatsappService.sendWhatsapp(
      tokenKeyData,
      notificationTemplate,
      TemplateModulo.CODIGO_TFA,
      replaceTemplate
    );

    await this.tfaService.insertCodeUser(type, loginUserTFA, code);

    return true;
  }
}
