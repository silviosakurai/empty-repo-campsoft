import { IWhatsappServiceInput } from "@core/interfaces/services/IWhatsapp.service";
import { TfaCodesWhatsAppRepository } from "@core/repositories/tfa/TfaCodesWhatsApp.repository";
import { WhatsappService } from "@core/services/whatsapp.service";
import { ViewApiResponse } from "@core/useCases/api/dtos/ViewApiResponse.dto";
import { injectable } from "tsyringe";
import { generateTokenTfa } from "@core/common/functions/generateTokenTfa";
import { TFAType } from "@core/common/enums/models/tfa";

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
      const message = await this.getTemplateWhatsapp(apiAccess, code);

      const payload = {
        target_phone: login,
        message: message,
      } as IWhatsappServiceInput;

      await this.whatsappService.send(payload);

      return await this.tfaCodesWhatsAppRepository.insertCodeUser(
        type,
        login,
        code
      );
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
  ): Promise<string> {
    const template =
      await this.tfaCodesWhatsAppRepository.getTemplateWhatsapp(apiAccess);

    return template.template.replace("{{code}}", code);
  }
}
