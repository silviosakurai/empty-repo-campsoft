import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { clientCards } from "@core/models";
import { eq, sql } from "drizzle-orm";
import { desc } from "drizzle-orm";

@injectable()
export class ClientCardListerByClientIdRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async list(clientId: string) {
    const results = await this.db
      .select({
        card_id: sql<string>`BIN_TO_UUID(${clientCards.card_id})`,
        external_id: clientCards.id_externo,
        brand: clientCards.brand,
        first_digits: clientCards.first_digits,
        expiration_month: sql`clientCards.expiration_month`.mapWith(Number),
        expiration_year: sql`clientCards.expiration_year`.mapWith(Number),
      })
      .from(clientCards)
      .orderBy(desc(clientCards.created_at))
      .where(eq(clientCards.id_cliente, sql`UUID_TO_BIN(${clientId})`));

    return results;
  }
}
