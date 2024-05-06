import { Type } from "@sinclair/typebox";
import { CouponRescueStatus } from "@core/common/enums/models/coupon";

export const voucherDetailsSchema = Type.Object({
  status: Type.String({ enum: Object.values(CouponRescueStatus) }),
  name: Type.Union([Type.String(), Type.Null()]),
  expires_at: Type.Union([Type.String(), Type.Null()]),
  code: Type.Union([Type.String(), Type.Null()]),
  months: Type.Union([Type.Number(), Type.Null()]),
});
