import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { eq, sql } from "drizzle-orm";
import { clientEmail, clientEmailNewsletter } from "@core/models";
import { ClientEmailViewResponse } from "@core/interfaces/repositories/client";

@injectable()
export class ClientEmailViewerByEmailRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async view(email: string): Promise<ClientEmailViewResponse[] | null> {
    const result = await this.db
      .select({
        clientId: sql`BIN_TO_UUID(${clientEmail.id_cliente})`,
        token: sql`BIN_TO_UUID(${clientEmail.token})`,
        emailTypeId: clientEmail.id_cliente_email_tipo,
      })
      .from(clientEmail)
      .leftJoin(
        clientEmailNewsletter,
        eq(clientEmail.id_cliente, clientEmailNewsletter.id_cliente)
      )
      .where(eq(clientEmail.email, email))
      .execute();

    if (!result.length) {
      return null;
    }

    return result as unknown as ClientEmailViewResponse[];
  }
}
