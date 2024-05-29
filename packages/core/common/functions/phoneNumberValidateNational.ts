export function phoneNumberValidateNational(phoneNumber: string): boolean {
  const regexNationalPhoneNumber = /^\d{10,11}$/;
  const cleanPhoneNumber = phoneNumber.replace(/[\s-()]/g, "");

  if (!regexNationalPhoneNumber.test(cleanPhoneNumber)) {
    return true;
  }

  return false;
}
