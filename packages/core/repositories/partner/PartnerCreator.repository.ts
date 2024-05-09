import * as schema from "@core/models";
import { partner } from "@core/models";
import { inject, injectable } from "tsyringe";
import { MySql2Database } from "drizzle-orm/mysql2";
import { CreatePartnerRequest } from "@core/useCases/partner/dtos/CreatePartnerRequest.dto";

@injectable()
export class PartnerCreatorRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async create(input: CreatePartnerRequest):  Promise<boolean> {
    const result = await this.db
      .insert(partner)
      .values({
        id_parceiro_tipo: input.id_company_type,
        status: input.status,
        nome_fantasia: input.trade_name,
        razao_social: input.legal_name,
        nome_responsavel: input.responsible_name,
        sobrenome_responsavel: input.responsible_lastname,
        email_responsavel: input.responsible_email,
        telefone: input.phone,
        cnpj: input.cnpj,
        obs: input.obs,
      })
      .execute();

    if (!result.length) {
      return false;
    }

    return true;
  }
}
