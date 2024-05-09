import { eq } from "drizzle-orm";
import * as schema from "@core/models";
import { partner } from "@core/models";
import { inject, injectable } from "tsyringe";
import { MySql2Database } from "drizzle-orm/mysql2";
import { UpdatePartnerRequest } from "@core/useCases/partner/dtos/UpdatePartnerRequest.dto";

@injectable()
export class PartnerUpdaterRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async update(partnerId: number, input: UpdatePartnerRequest):  Promise<boolean> {
    const result = await this.db
      .update(partner)
      .set({
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
      .where(eq(partner.id_parceiro, partnerId))
      .execute();

    if (!result.length) {
      return false;
    }

    return true;
  }
}
