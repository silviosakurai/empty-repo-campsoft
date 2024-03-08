import { TfaService } from "@core/services/tfa.service";
import { injectable } from "tsyringe";
import { SendWhatsAppTFARequest } from "@core/useCases/tfa/dtos/SendWhatsAppTFARequest.dto";

@injectable()
export class SendWhatsAppTFA {
  private tfaService: TfaService;

  constructor(tfaService: TfaService) {
    this.tfaService = tfaService;
  }

  async execute({
    apiAccess,
    type,
    login,
  }: SendWhatsAppTFARequest): Promise<boolean> {
    return await this.tfaService.sendWhatsApp(apiAccess, type, login);
  }
}
