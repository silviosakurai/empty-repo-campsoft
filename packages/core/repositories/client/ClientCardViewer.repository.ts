import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { clientCards } from "@core/models";
import { eq, sql } from "drizzle-orm";

@injectable()
export class ClientCardViewerRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async view(cardId: string) {
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
      .where(eq(clientCards.card_id, sql`UUID_TO_BIN(${cardId})`));

    if (!results.length) {
      return false;
    }

    return results[0];
  }
}
