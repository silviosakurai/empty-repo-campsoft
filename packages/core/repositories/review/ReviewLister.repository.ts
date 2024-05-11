import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { reviews } from "@core/models/review/index";
import { eq, sql } from "drizzle-orm";
import { ReviewListResponse } from "@core/interfaces/repositories/marketing";

@injectable()
export class ReviewListerRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async list(companyId: number) {
    const results = await this.db
      .select({
        review_id: reviews.id_depoimento,
        company_id: reviews.id_parceiro,
        status: reviews.status,
        name: reviews.nome,
        review: reviews.depoimento,
        photo: reviews.foto,
        rating: sql`${reviews.nota}`.mapWith(Number),
        created_at: reviews.created_at,
        updated_at: reviews.updated_at,
      })
      .from(reviews)
      .where(eq(reviews.id_parceiro, companyId));

    return results;
  }

  async listReviewByProductId(
    productId: string
  ): Promise<ReviewListResponse[]> {
    const results = await this.db
      .select({
        review_id: reviews.id_depoimento,
        status: reviews.status,
        name: reviews.nome,
        review: reviews.depoimento,
        photo: reviews.foto,
        rating: sql`${reviews.nota}`.mapWith(Number),
        created_at: reviews.created_at,
        updated_at: reviews.updated_at,
      })
      .from(reviews)
      .where(eq(reviews.id_produto, productId));

    if (!results.length) {
      return [] as ReviewListResponse[];
    }

    return results as ReviewListResponse[];
  }
}
