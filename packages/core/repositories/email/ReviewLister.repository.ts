import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { emailDomains } from "@core/models";
import { and, count, eq, like } from "drizzle-orm";
import { EmailBlock, EmailType } from "@core/common/enums/models/email";

@injectable()
export class EmailListerRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async isEmailDisposable(emailDomain: string): Promise<boolean> {
    const results = await this.db
      .select({
        total: count(),
      })
      .from(emailDomains)
      .where(
        and(
          like(emailDomains.email, emailDomain),
          eq(emailDomains.tipo, EmailType.DISPOSABLE),
          eq(emailDomains.bloquear, EmailBlock.YES)
        )
      );

    return results[0].total > 0;
  }
}
