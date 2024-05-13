import "reflect-metadata";
import { SmsTFAUserSenderCase } from "../../../useCases/tfa/SmsTFASender.useCase";
import { TfaService } from "@core/services/tfa.service";
import { SendCodeLoginTFARequest } from "@core/useCases/tfa/dtos/SendCodeTFARequest.dto";
import { PermissionsRoles } from "@core/common/enums/PermissionsRoles";
import { TFAType } from "@core/common/enums/models/tfa";
import { tokenKeyDataMock } from "@core/common/tests/tokenKeyDataMock";
import { loginUserMock } from "@core/common/tests/loginUserMock";
import { SmsService } from "@core/services/sms.service";

jest.mock("@core/services/tfa.service");
jest.mock("@core/services/sms.service");

const mockGeneratedCode = "123456";
const mockLoginUser = "18999999999";
const mockTemplate = { templateId: "1", template: "template" };

describe("Unit::SmsTFASenderCase", () => {
  let smsTFAUserSender: SmsTFAUserSenderCase;
  let mockTfaService: jest.Mocked<TfaService>;
  let mockSmsService: jest.Mocked<SmsService>;

  beforeEach(() => {
    mockTfaService = {
      generateAndVerifyToken: jest.fn().mockResolvedValue(mockGeneratedCode),
      insertCodeUser: jest.fn(),
      insertSmsHistory: jest.fn(),
      getTemplateSms: jest.fn().mockResolvedValue(mockTemplate),
    } as unknown as jest.Mocked<TfaService>;
    mockSmsService = {
      send: jest.fn().mockResolvedValue(true),
    } as unknown as jest.Mocked<SmsService>;
    smsTFAUserSender = new SmsTFAUserSenderCase(mockTfaService, mockSmsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should send SMS with the generated code and insert code and SMS history", async () => {
    const request: SendCodeLoginTFARequest = {
      tokenKeyData: tokenKeyDataMock({
        acoes: [PermissionsRoles.TFA_SEND_CODE],
      }),
      type: TFAType.SMS,
      loginUserTFA: loginUserMock({ login: mockLoginUser }),
    };

    const result = await smsTFAUserSender.execute(request);

    expect(mockTfaService.generateAndVerifyToken).toHaveBeenCalled();
    expect(mockSmsService.send).toHaveBeenCalledWith({
      phone: mockLoginUser,
      message: expect.any(String),
    });
    expect(mockTfaService.insertSmsHistory).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Object),
      true
    );
    expect(mockTfaService.insertCodeUser).toHaveBeenCalledWith(
      TFAType.SMS,
      expect.any(Object),
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

    mockSmsService.send.mockResolvedValue(null);

    const result = await smsTFAUserSender.execute(request);

    expect(mockTfaService.generateAndVerifyToken).toHaveBeenCalled();
    expect(mockSmsService.send).toHaveBeenCalledWith({
      phone: mockLoginUser,
      message: expect.any(String),
    });
    expect(mockTfaService.insertCodeUser).not.toHaveBeenCalled();
    expect(mockTfaService.insertSmsHistory).not.toHaveBeenCalled();
    expect(result).toBe(false);
  });
});
