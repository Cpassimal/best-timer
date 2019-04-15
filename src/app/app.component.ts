import { Component, HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';

const INTERVAL = 10; // ms
const TITLE = 'Timer';

interface ITimer {
  h: string;
  m: string;
  s: string;
  ms: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public startTime: number;
  public delta: number;
  public deltaFormated: ITimer;
  public lastResume: number;
  public pastTime: number;

  public isPaused: boolean = true;
  public isStart: boolean = true;
  public interval: number;

  constructor(
    private _title: Title,
  ) {
    this.resetTimer();
  }

  public play(): void {
    this.lastResume = Date.now();

    this.interval = setInterval(() => {
      this.delta = Date.now() - this.lastResume + this.pastTime;
      this.deltaFormated = this._formatTime(this.delta);
      this._title.setTitle(`${this.deltaFormated.h} : ${this.deltaFormated.m} : ${this.deltaFormated.s}`);
    }, INTERVAL);

    this.isStart = false;
  }

  public pause(): void {
    clearInterval(this.interval);
    this.pastTime = this.delta;
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
  }

  public resetTimer(): void {
    this.startTime = 0;
    this.pastTime = 0;
    this.delta = 0;
    this.deltaFormated = this._formatTime(this.delta);
    this._title.setTitle(TITLE);
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

  private _formatTime(value: number): ITimer {
    const hours = Math.trunc(value / 1000 / 3600);
    const mins = Math.trunc((value - hours * 3600 * 1000) / 1000 / 60);
    const secs = Math.trunc((value - hours * 3600 * 1000 - mins * 60 * 1000) / 1000);
    const ms = Math.trunc((value - hours * 3600 * 1000 - mins * 60 * 1000 - secs * 1000) / 10);

    const strHours = String(hours).length === 1 ? `0${String(hours)}` : String(hours);
    const strMins = String(mins).length === 1 ? `0${String(mins)}` : String(mins);
    const strSecs = String(secs).length === 1 ? `0${String(secs)}` : String(secs);
    const strMs = String(ms).length === 1 ? `0${String(ms)}` : String(ms);

    return {
      h: strHours,
      m: strMins,
      s: strSecs,
      ms: strMs,
    };
  }
}
