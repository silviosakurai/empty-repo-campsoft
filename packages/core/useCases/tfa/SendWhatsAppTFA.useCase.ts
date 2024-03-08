import { TfaService } from "@core/services/tfa.service";
import { injectable } from "tsyringe";
import { SendCodeTFARequest } from "@core/useCases/tfa/dtos/SendCodeTFARequest.dto";

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
  }: SendCodeTFARequest): Promise<boolean> {
    return await this.tfaService.sendWhatsApp(apiAccess, type, login);
  }
}