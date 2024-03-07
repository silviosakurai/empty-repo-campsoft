import { TFAType } from "@core/common/enums/TFAType";
import { IWhatsappServiceInput } from "@core/interfaces/services/IWhatsapp.service";
import { SmsEmailCodesRepository } from "@core/repositories/tfa/smsEmailCodes.repository";
import { WhatsappService } from "@core/services/whatsapp.service";
import { ViewApiResponse } from "@core/useCases/api/dtos/ViewApiResponse.dto";
import { injectable } from "tsyringe";

@injectable()
export class TfaService {
  private smsEmailCodesRepository: SmsEmailCodesRepository;
  private whatsappService: WhatsappService;

  constructor(
    smsEmailCodesRepository: SmsEmailCodesRepository,
    whatsappService: WhatsappService
  ) {
    this.smsEmailCodesRepository = smsEmailCodesRepository;
    this.whatsappService = whatsappService;
  }

  sendWhatsApp = async (
    apiAccess: ViewApiResponse,
    type: TFAType,
    login: string
  ): Promise<boolean> => {
    try {
      const code = await this.generateCode();

      const payload = {
        target_phone: login,
        message: `Your code is ${code}`,
      } as IWhatsappServiceInput;

      await this.whatsappService.send(payload);

      return await this.smsEmailCodesRepository.insertCodeUser(
        type,
        login,
        code
      );
    } catch (error) {
      throw error;
    }
  };

  private generateCode = async (): Promise<string> => {
    return await this.smsEmailCodesRepository.generateAndVerifyToken();
  };
}
