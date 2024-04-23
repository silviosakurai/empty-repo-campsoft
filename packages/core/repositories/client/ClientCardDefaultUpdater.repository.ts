import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { clientCards } from "@core/models";
import { sql, eq } from "drizzle-orm";

@injectable()
export class ClientCardDefaultUpdaterRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async create(input: { clientId: string; cardId: string; default: boolean }) {
    if (input.default) {
      await this.db
        .update(clientCards)
        .set({
          default: 0,
        })
        .where(eq(clientCards.id_cliente, sql`UUID_TO_BIN(${input.clientId})`));
    }

    const [result] = await this.db
      .update(clientCards)
      .set({
        default: input.default ? 1 : 0,
      })
      .where(eq(clientCards.card_id, input.cardId));

    if (!result.affectedRows) {
      return false;
    }

    return true;
  }
}
