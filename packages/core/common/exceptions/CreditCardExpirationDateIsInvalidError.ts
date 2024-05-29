class CreditCardExpirationDateIsInvalidError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CreditCardExpirationDateIsInvalidError";

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CreditCardExpirationDateIsInvalidError);
    }
  }
}

export default CreditCardExpirationDateIsInvalidError;
