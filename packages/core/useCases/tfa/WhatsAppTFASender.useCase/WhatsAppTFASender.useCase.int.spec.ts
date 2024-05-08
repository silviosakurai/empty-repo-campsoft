import "reflect-metadata";
import { container } from "tsyringe";
jest.mock("./");
import { WhatsAppTFASenderUserCase } from "./";
import { LoggerService } from "@core/services";
import { WhatsAppListerRepository } from "@core/repositories/whatsapp/WhatsAppLister.repository";
import { PermissionsRoles } from "@core/common/enums/PermissionsRoles";
import { TFAType } from "@core/common/enums/models/tfa";

describe("Int::WhatsAppTFASenderUseCase", () => {
  let service: WhatsAppTFASenderUserCase;
  let mockLoggerService: jest.Mocked<LoggerService>;
  let whatsappListerRepository: jest.Mocked<WhatsAppListerRepository>;

  beforeEach(() => {
    mockLoggerService = {
      error: jest.fn(),
    } as unknown as jest.Mocked<LoggerService>;
    whatsappListerRepository = {
      getTemplateWhatsapp: jest.fn(),
      getTemplateWhatsappToPartner: jest.fn(),
      insertWhatsAppHistory: jest.fn(),
    } as unknown as jest.Mocked<WhatsAppListerRepository>;

    container.register("LoggerService", { useValue: mockLoggerService });
    container.register("WhatsAppListerRepository", {
      useValue: whatsappListerRepository,
    });

    service = new WhatsAppTFASenderUserCase(
      container.resolve("LoggerService"),
      container.resolve("WhatsAppListerRepository")
    );
  });

  afterEach(() => {
    container.clearInstances();
  });

  test("must generate a tfa token", async () => {
    const result = await service.execute({
      loginUserTFA: { clientId: "123", login: "18999999999" },
      tokenKeyData: {
        acoes: [PermissionsRoles.TFA_SEND_CODE],
        id_api_key: 1,
        id_cargo: 1,
        id_parceiro: 1,
      },
      type: TFAType.WHATSAPP,
    });
  });
});
