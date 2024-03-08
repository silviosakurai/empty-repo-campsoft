import { paginationReaderSchema } from "@core/common/validations/pagination.validation";
import { BannerReaderRequestDto } from "@core/useCases/banner/dtos/BannerReaderRequest.dto";
import Schema from "fluent-json-schema";

const bannerReaderSchema = {
  querystring: Schema.object<BannerReaderRequestDto>()
    .prop("location", Schema.string().maxLength(20).required())
    .prop("type", Schema.integer().minimum(0).required())
    .extend(paginationReaderSchema),
};

export { bannerReaderSchema };
