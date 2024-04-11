import { TemplateModulo } from "@core/common/enums/TemplateMessage";
import { EmailDisposableNotAllowedError } from "@core/common/exceptions/EmailIsDisposableError";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { ClientService, EmailService } from "@core/services";
import { EmailDomainService } from "@core/services/emailDomain.service";
import { injectable } from "tsyringe";
import { TFunction } from "i18next";

@injectable()
export class ClientEmailNewsletterCreatorUseCase {
  constructor(
    private readonly emailService: EmailService,
    private readonly clientService: ClientService,
    private readonly emailDomainService: EmailDomainService
  ) {}

  async create(
    clientId: string,
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
      await this.clientService.createEmail({
        clientId,
        email,
        emailType: 1,
      });

      const emailCreated =
        await this.clientService.clientEmailViewByEmail(email);

      await this.emailService.sendEmail(
        tokenKey,
        { email, clientId },
        TemplateModulo.ATIVACAO_EMAIL,
        { code: emailCreated?.[0].token as string }
      );
    }

    await this.clientService.createEmailNewsletter(clientId, 2);

    return true;
  }
}
