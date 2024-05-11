export function obfuscateEmail(email: string): string {
  const parts = email.split("@");
  const username = parts[0].substring(0, 3) + "****";
  const domain = parts[1].split(".");
  const domainName = domain[0].substring(0, domain[0].length - 3) + "***";
  const topLevelDomain = domain[1];

  return `${username}@${domainName}.${topLevelDomain}`;
}
