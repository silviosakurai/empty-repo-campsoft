import * as schema from "@core/models";
import { eq, sql, and } from "drizzle-orm";
import { clientAddress } from "@core/models";
import { inject, injectable } from "tsyringe";
import { MySql2Database } from "drizzle-orm/mysql2";
import { ClientAddress } from "@core/common/enums/models/client";
import { ViewClientAddressDTO } from "@core/useCases/client/dtos/ViewClientAddressResponse.dto";

@injectable()
export class ClientAddressViewerRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async view(
    userId: string,
    type: ClientAddress,
  ): Promise<ViewClientAddressDTO | null> {
    const result = await this.db
      .select({
        shipping_address_enum: clientAddress.endereco_envio,
        zip_code: clientAddress.cep,
        street: clientAddress.rua,
        number: clientAddress.numero,
        complement: clientAddress.complemento,
        neighborhood: clientAddress.bairro,
        phone: clientAddress.telefone,
        city: clientAddress.cidade,
        state: clientAddress.uf,
        created_at: clientAddress.created_at,
        updated_at: clientAddress.updated_at,
      })
      .from(clientAddress)
      .where(
        and(
          eq(clientAddress.id_cliente, sql`UUID_TO_BIN(${userId})`),
          eq(clientAddress.tipo, type),
        )
      )
      .execute();

    if (!result.length) {
      return null;
    }

    return result[0] as unknown as ViewClientAddressDTO;
  }
}
