import { VoucherViewRequestDto } from "@core/useCases/voucher/dtos/VoucherViewRequest.dto";
import Schema from "fluent-json-schema";

const voucherSchema = {
  params: Schema.object<VoucherViewRequestDto>().prop(
    "voucherCode",
    Schema.string().required()
  ),
};

export { voucherSchema };
