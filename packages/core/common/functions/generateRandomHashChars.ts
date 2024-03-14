export function generateRandomHashChars(hashLength: number = 256): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let hash = "";

  for (let i = 0; i < hashLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);

    hash += characters.charAt(randomIndex);
  }

  return hash;
}
