import { ITimer } from "./interfaces";

export function formatTimes(value: number): string {
  return String(value).length === 1 ? `0${String(value)}` : String(value);
}

export function formatTimeToTimer(value: number): ITimer {
  const hours = Math.trunc(value / 1000 / 3600);
  const mins = Math.trunc((value - hours * 3600 * 1000) / 1000 / 60);
  const secs = Math.trunc((value - hours * 3600 * 1000 - mins * 60 * 1000) / 1000);
  const ms = Math.trunc((value - hours * 3600 * 1000 - mins * 60 * 1000 - secs * 1000) / 10);

  const strHours = formatTimes(hours);
  const strMins = formatTimes(mins);
  const strSecs = formatTimes(secs);
  const strMs = formatTimes(ms);

  return {
    h: strHours,
    m: strMins,
    s: strSecs,
    ms: strMs,
  };
}
