import { EmailListerRepository } from "@core/repositories/email/EmailLister.repository";
import { injectable } from "tsyringe";

@injectable()
export class EmailDomainService {
  constructor(private readonly emailListerRepository: EmailListerRepository) {}

  isEmailDisposable = async (email: string): Promise<boolean> => {
    const emailDomain = email.split("@")[1];

    return this.emailListerRepository.isEmailDisposable(emailDomain);
  };
}
