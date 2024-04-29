import CreditCardExpirationDateIsInvalidError from "../exceptions/CreditCardExpirationDateIsInvalidError";

export function checkIfDateIsAfterOfCurrent(
  expirationMonth: number,
  expirationYear: number
) {
  const last2DigitsOfCurrentYear = new Date().getFullYear() % 100;
  const currentMonth = new Date().getMonth() + 1;

  if (expirationYear < last2DigitsOfCurrentYear) {
    throw new CreditCardExpirationDateIsInvalidError("Invalid Year");
  }

  if (
    expirationYear === last2DigitsOfCurrentYear &&
    expirationMonth <= currentMonth
  ) {
    throw new CreditCardExpirationDateIsInvalidError("Invalid Month");
  }

  return true;
}
