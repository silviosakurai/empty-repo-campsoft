import { TemplateModulo } from "@core/common/enums/TemplateMessage";
import { EmailDisposableNotAllowedError } from "@core/common/exceptions/EmailIsDisposableError";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { EmailDomainService } from "@core/services/emailDomain.service";
import { injectable } from "tsyringe";
import { TFunction } from "i18next";
import { EmailService } from "@core/services/email.service";
import { ClientService } from "@core/services/client.service";

@injectable()
export class ClientEmailNewsletterCreatorUseCase {
  constructor(
    private readonly emailService: EmailService,
    private readonly clientService: ClientService,
    private readonly emailDomainService: EmailDomainService
  ) {}

  async create(
    email: string,
    tokenKey: ITokenKeyData,
    t: TFunction<"translation", undefined>
  ) {
    const emailIsDisposable =
      await this.emailDomainService.isEmailDisposable(email);

    if (emailIsDisposable) {
      throw new EmailDisposableNotAllowedError(
        t("email_disposable_not_allowed")
      );
    }

    const client = await this.clientService.clientEmailViewByEmail(email);

    if (client?.some((item) => item.hasNewsletter)) {
      return null;
    }

    if (!client?.[0].token) {
      await this.clientService.createEmail(email);

      const emailCreated =
        await this.clientService.clientEmailViewByEmail(email);

      this.emailService.sendEmail(
        tokenKey,
        { email },
        TemplateModulo.ATIVACAO_EMAIL,
        { code: emailCreated?.[0].token as string }
      );
    }

    return true;
  }
}
