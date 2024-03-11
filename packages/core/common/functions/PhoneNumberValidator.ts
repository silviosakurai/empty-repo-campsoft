import { injectable } from "tsyringe";
import { InvalidPhoneNumberError } from "../exceptions/InvalidPhoneNumberError";

@injectable()
export class PhoneNumberValidator {
  validate(phoneNumber: string): null | InvalidPhoneNumberError {
    const regexInternationalPhoneNumber = /^\+?[1-9]\d{1,14}$/;

    const cleanPhoneNumber = phoneNumber.replace(/[\s-()]/g, "");

    if (!regexInternationalPhoneNumber.test(cleanPhoneNumber)) {
      throw new InvalidPhoneNumberError("Invalid phone number.");
    }

    return null;
  }

  validateNational(phoneNumber: string): null | InvalidPhoneNumberError {
    const regexNationalPhoneNumber = /^\d{10,11}$/;

    const cleanPhoneNumber = phoneNumber.replace(/[\s-()]/g, "");

    if (!regexNationalPhoneNumber.test(cleanPhoneNumber)) {
      throw new InvalidPhoneNumberError("Invalid phone number.");
    }

    return null;
  }
}
