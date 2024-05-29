export function phoneNumberIncludesCountryCode(phoneNumber: string): string {
  if (!phoneNumber.startsWith("+")) {
    return `+55${phoneNumber}`;
  }

  return phoneNumber;
}
