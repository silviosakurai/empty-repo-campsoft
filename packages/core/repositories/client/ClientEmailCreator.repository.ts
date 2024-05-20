import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { clientEmail } from "@core/models/client";
import { MySql2Database } from "drizzle-orm/mysql2";
import { EmailType } from "@core/common/enums/models/clientEmail";

@injectable()
export class ClientEmailCreatorRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async create(email: string) {
    const result = await this.db
      .insert(clientEmail)
      .values({
        email: email,
        id_cliente_email_tipo: EmailType.NEWSLETTER,
      })
      .execute();

    if (!result) {
      return false;
    }

    return true;
  }
}
