export function phoneNumberValidator(phoneNumber: string): boolean {
  const regexInternationalPhoneNumber = /^\+?[1-9]\d{1,14}$/;
  const cleanPhoneNumber = phoneNumber.replace(/[\s-()]/g, "");

  if (!regexInternationalPhoneNumber.test(cleanPhoneNumber)) {
    return true;
  }

  return false;
}
