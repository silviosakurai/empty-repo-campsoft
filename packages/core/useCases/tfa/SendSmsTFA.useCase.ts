import { TfaService } from "@core/services/tfa.service";
import { injectable } from "tsyringe";
import { SendCodeTFARequest } from "@core/useCases/tfa/dtos/SendCodeTFARequest.dto";

@injectable()
export class SendSmsTFA {
  private tfaService: TfaService;

  constructor(tfaService: TfaService) {
    this.tfaService = tfaService;
  }

  async execute({
    apiAccess,
    type,
    login,
  }: SendCodeTFARequest): Promise<boolean> {
    const code = await this.tfaService.generateAndVerifyToken();

    console.log("code", code);

    return true;
  }
}
