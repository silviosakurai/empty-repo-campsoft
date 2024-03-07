import { IWhatsappServiceInput } from "@core/interfaces/services/IWhatsapp.service";
import { TfaCodesRepository } from "@core/repositories/tfa/tfaCodes.repository";
import { WhatsappService } from "@core/services/whatsapp.service";
import { ViewApiResponse } from "@core/useCases/api/dtos/ViewApiResponse.dto";
import { injectable } from "tsyringe";
import { generateTokenTfa } from "@core/common/functions/generateTokenTfa";
import { TFAType } from "@core/common/enums/models/tfa";

@injectable()
export class TfaService {
  private tfaCodesRepository: TfaCodesRepository;
  private whatsappService: WhatsappService;

  constructor(
    tfaCodesRepository: TfaCodesRepository,
    whatsappService: WhatsappService
  ) {
    this.tfaCodesRepository = tfaCodesRepository;
    this.whatsappService = whatsappService;
  }

  sendWhatsApp = async (
    apiAccess: ViewApiResponse,
    type: TFAType,
    login: string
  ): Promise<boolean> => {
    try {
      const code = await this.generateAndVerifyToken();

      const payload = {
        target_phone: login,
        message: `Seu código de verificação é *${code}*. Para sua segurança, não o compartilhe.`,
      } as IWhatsappServiceInput;

      await this.whatsappService.send(payload);

      return await this.tfaCodesRepository.insertCodeUser(type, login, code);
    } catch (error) {
      throw error;
    }
  };

  private async generateAndVerifyToken(): Promise<string> {
    let token;
    let isUnique = false;

    do {
      token = generateTokenTfa();

      isUnique = await this.tfaCodesRepository.isTokenUniqueAndValid(token);
    } while (!isUnique);

    return token;
  }
}
