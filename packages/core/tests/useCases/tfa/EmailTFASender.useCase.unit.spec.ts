import "reflect-metadata";
import { EmailTFASenderUserCase } from "../../../useCases/tfa/EmailTFASender.useCase";
import { TfaService } from "@core/services/tfa.service";
import { SendCodeLoginTFARequest } from "@core/useCases/tfa/dtos/SendCodeTFARequest.dto";
import { PermissionsRoles } from "@core/common/enums/PermissionsRoles";
import { TFAType } from "@core/common/enums/models/tfa";
import { tokenKeyDataMock } from "@core/common/tests/tokenKeyDataMock";
import { loginUserMock } from "@core/common/tests/loginUserMock";
import { EmailService } from "@core/services";
import { TemplateModulo } from "@core/common/enums/TemplateMessage";

jest.mock("@core/services/tfa.service");
jest.mock("@core/services/sms.service");

const mockGeneratedCode = "123456";
const mockLoginUser = "18999999999";
const mockTemplate = { templateId: '1', template: "template" }

describe("Unit::EmailTFASenderCase", () => {
  let emailTFASender: EmailTFASenderUserCase;
  let mockTfaService: jest.Mocked<TfaService>;
  let mockEmailService: jest.Mocked<EmailService>;

  beforeEach(() => {
    mockTfaService = {
      generateAndVerifyToken: jest.fn().mockResolvedValue(mockGeneratedCode),
      insertCodeUser: jest.fn(),
    } as unknown as jest.Mocked<TfaService>;
    mockEmailService = {
      sendEmail: jest.fn().mockResolvedValue(true),
    } as unknown as jest.Mocked<EmailService>;
    emailTFASender = new EmailTFASenderUserCase(
      mockTfaService,
      mockEmailService
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should send Email and insert code", async () => {
    const loginUserTFA = loginUserMock();
    const tokenKeyData = tokenKeyDataMock({
      acoes: [PermissionsRoles.TFA_SEND_CODE],
    });

    const request: SendCodeLoginTFARequest = {
      tokenKeyData,
      type: TFAType.EMAIL,
      loginUserTFA,
    };

    const result = await emailTFASender.execute(request);

    expect(mockTfaService.generateAndVerifyToken).toHaveBeenCalled();
    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Object),
      TemplateModulo.CODIGO_TFA,
      { code: mockGeneratedCode },
    );
    expect(mockTfaService.insertCodeUser).toHaveBeenCalledWith(
      TFAType.EMAIL,
      loginUserTFA,
      "123456"
    );
    expect(result).toBe(true);
  });

  it("should not send SMS if sending fails", async () => {
    const request: SendCodeLoginTFARequest = {
      tokenKeyData: tokenKeyDataMock({
        acoes: [PermissionsRoles.TFA_SEND_CODE],
      }),
      type: TFAType.SMS,
      loginUserTFA: loginUserMock({ login: mockLoginUser }),
    };

    mockEmailService.sendEmail.mockResolvedValue(false);

    const result = await emailTFASender.execute(request);

    expect(mockTfaService.generateAndVerifyToken).toHaveBeenCalled();
    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Object),
      TemplateModulo.CODIGO_TFA,
      { code: mockGeneratedCode },
    );
    expect(mockTfaService.insertCodeUser).not.toHaveBeenCalled();
    expect(result).toBe(false);
  });
});
