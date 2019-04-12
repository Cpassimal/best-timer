import { Pipe } from '@angular/core';

@Pipe({
  name: 'timeFormat',
})
export class TimeFormatPipe {
  public transform(value: number): string {
    const hours = Math.trunc(value / 1000 / 3600);
    const mins = Math.trunc((value - hours * 3600 * 1000) / 1000 / 60);
    const secs = Math.trunc((value - hours * 3600 * 1000 - mins * 60 * 1000) / 1000);
    const ms = Math.trunc((value - hours * 3600 * 1000 - mins * 60 * 1000 - secs * 1000) / 10);

    const strHours = String(hours).length === 1 ? `0${String(hours)}` : String(hours);
    const strMins = String(mins).length === 1 ? `0${String(mins)}` : String(mins);
    const strSecs = String(secs).length === 1 ? `0${String(secs)}` : String(secs);
    const strMs = String(ms).length === 1 ? `0${String(ms)}` : String(ms);

    return `${strHours} : ${strMins} : ${strSecs} : ${strMs}`;
  }
}
