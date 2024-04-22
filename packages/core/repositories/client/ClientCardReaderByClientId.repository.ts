import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { clientCards } from "@core/models";
import { eq, sql } from "drizzle-orm";
import { and } from "drizzle-orm";

@injectable()
export class ClientCardReaderByClientIdRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async read(clientId: string) {
    const results = await this.db
      .select({
        card_id: sql`BIN_TO_UUID(${clientCards.card_id})`,
        external_id: clientCards.id_externo,
        brand: clientCards.brand,
        first_digits: clientCards.first_digits,
        expiration_month: sql<
          number | null
        >`LEFT(${clientCards.expiration_date})`,
        expiration_year: sql<
          number | null
        >`RIGHT(${clientCards.expiration_date})`,
      })
      .from(clientCards)
      .where(and(eq(clientCards.id_cliente, sql`UUID_TO_BIN(${clientId})`)));

    return results;
  }
}
