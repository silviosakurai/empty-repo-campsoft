import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { clientCards } from "@core/models";
import { ClientCardRepositoryInput } from "@core/interfaces/repositories/client";
import { sql } from "drizzle-orm";

@injectable()
export class ClientCardCreatorRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async create(clientId: string, input: ClientCardRepositoryInput) {
    const [result] = await this.db.insert(clientCards).values({
      id_externo: input.externalId,
      token_id: input.tokenId,
      brand: input.brand,
      default: input.default ? 1 : 0,
      expiration_month: input.expiration_month.toLocaleString("en-us", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      }),
      expiration_year: input.expiration_year.toString(),
      first_digits: input.first4Digits,
      last_digits: input.last4Digits,
      id_cliente: sql`UUID_TO_BIN(${clientId})`,
      valid: 1,
    });

    if (!result.affectedRows) {
      return false;
    }

    return true;
  }
}
