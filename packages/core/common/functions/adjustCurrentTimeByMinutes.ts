import { tz } from "moment-timezone";

export function adjustCurrentTimeByMinutes(
  minutes: number = 15,
  subtract: boolean = true
): string {
  const timeZone = "America/Sao_Paulo";
  const nowInTimeZone = tz(new Date(), timeZone);

  const adjustedTime = subtract
    ? nowInTimeZone.subtract(minutes, "minutes")
    : nowInTimeZone.add(minutes, "minutes");

  return adjustedTime.format("YYYY-MM-DD HH:mm:ss");
}
