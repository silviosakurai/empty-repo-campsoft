import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { reviews } from "@core/models/review/index";
import { eq, sql } from "drizzle-orm";

@injectable()
export class ReviewListerRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>,
  ) {}

  async list(companyId: number) {
    const results = await this.db
      .select({
        review_id: reviews.id_depoimento,
        company_id: reviews.id_empresa,
        status: reviews.status,
        name: reviews.nome,
        review: reviews.depoimento,
        photo: reviews.foto,
        rating: sql`${reviews.nota}`.mapWith(Number),
        created_at: reviews.created_at,
        updated_at: reviews.updated_at,
      })
      .from(reviews)
      .where(eq(reviews.id_empresa, companyId));

    return results;
  }
}
