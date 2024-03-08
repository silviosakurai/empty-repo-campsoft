import { InvalidPhoneNumberError } from "../exceptions/InvalidPhoneNumberError";

export function phoneNumberValidate(
  phoneNumber: string
): null | InvalidPhoneNumberError {
  const regexPhoneNumberAndDDD = /^\d{11}$/;

  if (!regexPhoneNumberAndDDD.test(phoneNumber)) {
    return new InvalidPhoneNumberError("Invalid phone number.");
  }

  return null;
}
