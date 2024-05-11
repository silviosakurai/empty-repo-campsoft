import { phoneNumberIncludesCountryCode } from "@core/common/functions/phoneNumberIncludesCountryCode";

describe("Unit::phoneNumberIncludesCountryCode", () => {
  test("must return an exact phone number", () => {
    const phoneNumber = "+5518999999999";

    expect(phoneNumberIncludesCountryCode(phoneNumber)).toEqual(phoneNumber);
  });

  test("must complement number with country code", () => {
    const phoneNumber = "18999999999";

    expect(phoneNumberIncludesCountryCode(phoneNumber)).toEqual(
      `+55${phoneNumber}`
    );
  });
});
