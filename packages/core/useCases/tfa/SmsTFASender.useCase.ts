import { TfaService } from "@core/services/tfa.service";
import { injectable } from "tsyringe";
import { SendCodeLoginTFARequest } from "@core/useCases/tfa/dtos/SendCodeTFARequest.dto";
import { ITemplateSMS } from "@core/interfaces/repositories/tfa";
import { SmsService } from "@core/services/sms.service";
import { ISmsServiceSendInput } from "@core/interfaces/services/ISms.service";
import { replaceTemplate } from "@core/common/functions/replaceTemplate";
import { IReplaceTemplate } from "@core/common/interfaces/IReplaceTemplate";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";

@injectable()
export class SmsTFAUserSenderCase {
  constructor(
    private readonly tfaService: TfaService,
    private readonly smsService: SmsService
  ) {}

  async execute({
    tokenKeyData,
    type,
    loginUserTFA,
  }: SendCodeLoginTFARequest): Promise<boolean> {
    const code = await this.tfaService.generateAndVerifyToken();
    const { template, templateId } = await this.getTemplateSMS(
      tokenKeyData,
      code
    );

    const payload = {
      phone: loginUserTFA.login,
      message: template,
    } as ISmsServiceSendInput;

    const sendSms = await this.smsService.send(payload);

    if (sendSms) {
      await this.tfaService.insertSmsHistory(templateId, loginUserTFA, sendSms);
      await this.tfaService.insertCodeUser(type, loginUserTFA, code);
      return true;
    }


    return false;
  }

  async getTemplateSMS(
    tokenKeyData: ITokenKeyData,
    code: string
  ): Promise<ITemplateSMS> {
    const template = await this.tfaService.getTemplateSms(tokenKeyData);

    template.template = replaceTemplate(template.template, {
      code,
    } as IReplaceTemplate);

    return template;
  }
}
