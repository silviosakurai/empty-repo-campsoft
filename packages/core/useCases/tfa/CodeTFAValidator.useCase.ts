import { TfaService } from "@core/services/tfa.service";
import { injectable } from "tsyringe";
import { ValidateCodeTFARequest } from "@core/useCases/tfa/dtos/ValidateCodeTFARequest.dto";
import { IValidateCodeTFA } from "@core/interfaces/repositories/tfa";
import { isUuid } from "@core/common/functions/isUuid";

@injectable()
export class CodeTFAValidatorUserCase {
  constructor(private readonly tfaService: TfaService) {}

  async execute({
    login,
    code,
  }: ValidateCodeTFARequest): Promise<IValidateCodeTFA | null> {
    const isUuidValid = isUuid(login);

    return await this.tfaService.validateCode(login, code, isUuidValid);
  }
}
