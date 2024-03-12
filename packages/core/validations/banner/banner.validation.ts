import { paginationReaderSchema } from "@core/common/validations/pagination.validation";
import { BannerReaderRequestDto } from "@core/useCases/banner/dtos/BannerReaderRequest.dto";
import Schema from "fluent-json-schema";

const bannerReaderSchema = {
  querystring: Schema.object<BannerReaderRequestDto>()
    .prop("location", Schema.string())
    .prop("type", Schema.integer().minimum(0))
    .extend(paginationReaderSchema),
};

export { bannerReaderSchema };
