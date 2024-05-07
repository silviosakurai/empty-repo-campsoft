import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { clientCards } from "@core/models";
import { eq, sql } from "drizzle-orm";

@injectable()
export class ClientCardEraserRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async erase(cardId: string) {
    const [result] = await this.db
      .delete(clientCards)
      .where(eq(clientCards.card_id, sql`UUID_TO_BIN(${cardId})`));

    if (!result.affectedRows) {
      return false;
    }

    return true;
  }
}
