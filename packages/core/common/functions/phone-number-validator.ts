import { injectable } from "tsyringe";
import { InvalidPhoneNumberError } from "../exceptions/InvalidPhoneNumberError";

@injectable()
export class PhoneNumberValidator {
  validate(phoneNumber: string): null | InvalidPhoneNumberError {
    const regexPhoneNumberAndDDD = /^\d{11}$/;

    if (!regexPhoneNumberAndDDD.test(phoneNumber)) {
      return new InvalidPhoneNumberError("Invalid phone number.");
    }

    return null;
  }
}
