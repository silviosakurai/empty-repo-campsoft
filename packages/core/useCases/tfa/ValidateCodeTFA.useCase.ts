import { TfaService } from "@core/services/tfa.service";
import { injectable } from "tsyringe";
import { ValidateCodeTFARequest } from "@core/useCases/tfa/dtos/ValidateCodeTFARequest.dto";
import { IValidateCodeTFA } from "@core/interfaces/repositories/tfa";

@injectable()
export class ValidateCodeTFA {
  private tfaService: TfaService;

  constructor(tfaService: TfaService) {
    this.tfaService = tfaService;
  }

  async execute({
    login,
    code,
  }: ValidateCodeTFARequest): Promise<IValidateCodeTFA | null> {
    return await this.tfaService.validateCode(login, code);
  }
}
