import "reflect-metadata";
import { CodeTFAValidatorUserCase } from "../../../useCases/tfa/CodeTFAValidator.useCase";
import { TfaService } from "@core/services/tfa.service";
import { ValidateCodeTFARequest } from "@core/useCases/tfa/dtos/ValidateCodeTFARequest.dto";
import { IValidateCodeTFA } from "@core/interfaces/repositories/tfa";
import { faker } from "@faker-js/faker";

jest.mock("@core/services/tfa.service");

describe("Unit::CodeTFAValidatorUseCase", () => {
  let codeTFAValidator: CodeTFAValidatorUserCase;
  let mockTfaService: jest.Mocked<TfaService>;

  beforeEach(() => {
    mockTfaService = {
      validateCode: jest.fn(),
    } as unknown as jest.Mocked<TfaService>;
    codeTFAValidator = new CodeTFAValidatorUserCase(mockTfaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("execute returns null if login is not a valid UUID", async () => {
    const mockRequest: ValidateCodeTFARequest = {
      login: "invalid-uuid",
      code: "123456",
    };

    const result = await codeTFAValidator.execute(mockRequest);

    expect(result).toBeFalsy();
  });

  test("execute calls TfaService.validateCode if login is a valid UUID", async () => {
    const mockRequest: ValidateCodeTFARequest = {
      login: faker.string.uuid(),
      code: "123456",
    };

    const mockValidationResult: IValidateCodeTFA = {
      id: 1,
      token: "valid-token",
    };

    mockTfaService.validateCode.mockResolvedValue(mockValidationResult);

    const result = await codeTFAValidator.execute(mockRequest);

    expect(result).toEqual(mockValidationResult);
    expect(mockTfaService.validateCode).toHaveBeenCalledWith(
      mockRequest.login,
      mockRequest.code,
      true
    );
  });
});
