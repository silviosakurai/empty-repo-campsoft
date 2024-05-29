export function obfuscatePhone(phone: string): string {
  return `${phone.substring(0, 2)}*****${phone.substring(phone.length - 4)}`;
}
