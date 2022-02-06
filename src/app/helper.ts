import { TimerPart, TimerPartType } from "./interfaces";

export function formatTimes(value: number): string {
  return String(value).length === 1 ? `0${String(value)}` : String(value);
}

export function setTimerPartsValues(
  timerParts: TimerPart[],
  value: number,
): void {
  const hours = Math.trunc(value / 1000 / 3600);
  const withoutHours = value - hours * 3600 * 1000;
  const mins = Math.trunc(withoutHours / 1000 / 60);
  const withoutMinutes = withoutHours - mins * 60 * 1000;
  const secs = Math.trunc(withoutMinutes / 1000);
  const ms = Math.trunc((withoutMinutes - secs * 1000) / 10);

  const strHours = formatTimes(hours);
  const strMins = formatTimes(mins);
  const strSecs = formatTimes(secs);
  const strMs = formatTimes(ms);

  for (const timerPart of timerParts) {
    if (timerPart.type === TimerPartType.h) {
      timerPart.value = strHours;
    }

    if (timerPart.type === TimerPartType.m) {
      timerPart.value = strMins;
    }

    if (timerPart.type === TimerPartType.s) {
      timerPart.value = strSecs;
    }

    if (timerPart.type === TimerPartType.ms) {
      timerPart.value = strMs;
    }
  }
}

export function formatTimerToTime(timerParts: TimerPart[]): number {
  let time = 0;

  for (const timerPart of timerParts) {
    if (timerPart.type === TimerPartType.h) {
      time += +timerPart.value * 3600 * 1000;
    }

    if (timerPart.type === TimerPartType.m) {
      time += +timerPart.value * 60 * 1000;
    }

    if (timerPart.type === TimerPartType.s) {
      time += +timerPart.value * 1000;
    }

    if (timerPart.type === TimerPartType.ms) {
      time += +timerPart.value * 10;
    }
  }

  return time;
}

export function getTitle(timerParts: TimerPart[]): string {
  let hour: string;
  let min: string;
  let sec: string;

  for (const timerPart of timerParts) {
    if (timerPart.type === TimerPartType.h) {
      hour = timerPart.value;
    }

    if (timerPart.type === TimerPartType.m) {
      min = timerPart.value;
    }

    if (timerPart.type === TimerPartType.s) {
      sec = timerPart.value;
    }
  }

  return `${hour} : ${min} : ${sec}`
}
