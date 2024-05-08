import "reflect-metadata";
import { WhatsAppTFASenderUserCase } from ".";
import { TfaService } from "@core/services/tfa.service";
import { WhatsappService } from "@core/services/whatsapp.service";
import { SendCodeLoginTFARequest } from "@core/useCases/tfa/dtos/SendCodeTFARequest.dto";
import { TemplateModulo } from "@core/common/enums/TemplateMessage";
import { PermissionsRoles } from "@core/common/enums/PermissionsRoles";
import { TFAType } from "@core/common/enums/models/tfa";
import { tokenKeyDataMock } from "@core/common/tests/tokenKeyDataMock";
import { loginUserMock } from "@core/common/tests/loginUserMock";

jest.mock("@core/services/tfa.service");
jest.mock("@core/services/whatsapp.service");

describe("Unit::WhatsAppTFASenderUserCase", () => {
  let whatsappTFASender: WhatsAppTFASenderUserCase;
  let mockTfaService: jest.Mocked<TfaService>;
  let mockWhatsappService: jest.Mocked<WhatsappService>;

  beforeEach(() => {
    mockTfaService = {
      generateAndVerifyToken: jest.fn(),
      insertCodeUser: jest.fn(),
    } as unknown as jest.Mocked<TfaService>;
    mockWhatsappService = {
      sendWhatsapp: jest.fn(),
    } as unknown as jest.Mocked<WhatsappService>;
    whatsappTFASender = new WhatsAppTFASenderUserCase(
      mockTfaService,
      mockWhatsappService
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("must send token to whatsapp", async () => {
    const mockRequest: SendCodeLoginTFARequest = {
      loginUserTFA: loginUserMock({ login: "18999999999" }),
      tokenKeyData: tokenKeyDataMock({
        acoes: [PermissionsRoles.TFA_SEND_CODE],
      }),
      type: TFAType.WHATSAPP,
    };

    const mockGeneratedCode = "123456";
    mockTfaService.generateAndVerifyToken.mockResolvedValue(mockGeneratedCode);

    const mockNotificationTemplate = {
      phoneNumber: mockRequest.loginUserTFA.login,
      clientId: mockRequest.loginUserTFA.clientId,
    };
    const mockReplaceTemplate = { code: mockGeneratedCode };

    const result = await whatsappTFASender.execute(mockRequest);

    expect(mockTfaService.generateAndVerifyToken).toHaveBeenCalled();
    expect(mockWhatsappService.sendWhatsapp).toHaveBeenCalledWith(
      mockRequest.tokenKeyData,
      mockNotificationTemplate,
      TemplateModulo.CODIGO_TFA,
      mockReplaceTemplate
    );
    expect(mockTfaService.insertCodeUser).toHaveBeenCalledWith(
      mockRequest.type,
      mockRequest.loginUserTFA,
      mockGeneratedCode
    );
    expect(result).toBeTruthy();
  });

  test("Executes WhatsApp message sending and returns an error if token generation fails", async () => {
    const mockRequest: SendCodeLoginTFARequest = {
      loginUserTFA: { clientId: "123", login: "18999999999" },
      tokenKeyData: {
        acoes: [PermissionsRoles.TFA_SEND_CODE],
        id_api_key: 1,
        id_cargo: 1,
        id_parceiro: 1,
      },
      type: TFAType.WHATSAPP,
    };

    mockTfaService.generateAndVerifyToken.mockRejectedValue(
      new Error("Error inserting code")
    );

    await expect(() => whatsappTFASender.execute(mockRequest)).rejects.toThrow(
      "Error inserting code"
    );

    expect(mockTfaService.insertCodeUser).not.toHaveBeenCalled();
    expect(mockWhatsappService.sendWhatsapp).not.toHaveBeenCalled();
  });
});
