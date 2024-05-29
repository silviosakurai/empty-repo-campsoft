export function getLastFourDigits(cardNumber: string | null): string | null {
  if (!cardNumber) {
    return null;
  }

  return cardNumber.slice(-4);
}
