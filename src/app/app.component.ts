import { Component, HostListener, NgZone } from '@angular/core';

interface ITimer {
  h: number;
  m: number;
  s: number;
  ms: number;
}

const INTERVAL = 10; // ms
const INIT_TIMER = {
  h: 0,
  m: 0,
  s: 0,
  ms: 0,
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public timer: ITimer;
  public formattedTimer: string;
  public isPaused: boolean = true;
  public isStart: boolean = true;
  public interval: number;

  constructor() {
    this.resetTimer();
    this._formatTimer();
  }

  public play(): void {
    this.interval = setInterval(() => {
      if (this.timer.ms < 990) {
        this.timer.ms += 10;
      } else {
        this.timer.ms = 0;

        if (this.timer.s < 59) {
          this.timer.s += 1;
        } else {
          this.timer.s = 0;

          if (this.timer.m < 59) {
            this.timer.m += 1;
          } else {
            this.timer.m = 0;

            this.timer.h += 1;
          }
        }
      }

      this._formatTimer();

    }, INTERVAL);

    this.isStart = false;
  }

  public pause(): void {
    clearInterval(this.interval);
  }

  public togglePause(): void {
    if (this.isPaused) {
      this.play();
    } else {
      this.pause();
    }

    this.isPaused = !this.isPaused;
  }

  public clear(): void {
    this.pause();
    this.isStart = true;
    this.isPaused = true;
    this.resetTimer();
    this._formatTimer();
  }

  public resetTimer(): void {
    this.timer = { ...INIT_TIMER };
  }

  @HostListener('document:keydown', ['$event'])
  public onKeyBoardEvent(event: KeyboardEvent): void {
    switch (event.code) {
      case 'Enter':
      case 'Space': {
        this.togglePause();

        break;
      }
      case 'Delete':
      case 'Backspace': {
        this.clear();

        break;
      }
    }
  }

  private _formatTimer(): void {
    const strHours = String(this.timer.h).length === 1 ? `0${String(this.timer.h)}` : String(this.timer.h);
    const strMins = String(this.timer.m).length === 1 ? `0${String(this.timer.m)}` : String(this.timer.m);
    const strSecs = String(this.timer.s).length === 1 ? `0${String(this.timer.s)}` : String(this.timer.s);

    const ms = Math.trunc(this.timer.ms / 10);
    const strMs = String(ms).length === 1
      ? `0${String(ms)}`
      : String(ms);

    this.formattedTimer = `${strHours} : ${strMins} : ${strSecs} : ${strMs}`;
  }
}
