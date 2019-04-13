import { Component, HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TimeFormatPipe } from './pipes/time-format.pipe';

const INTERVAL = 10; // ms
const TITLE = 'Timer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public startTime: number;
  public delta: number;
  public deltaFormated: string;
  public lastResume: number;
  public pastTime: number;

  public isPaused: boolean = true;
  public isStart: boolean = true;
  public interval: number;

  constructor(
    private _title: Title,
    private _formatPipe: TimeFormatPipe,
  ) {
    this.resetTimer();
  }

  public play(): void {
    this.lastResume = Date.now();

    this.interval = setInterval(() => {
      this.delta = Date.now() - this.lastResume + this.pastTime;
      this.deltaFormated = this._formatPipe.transform(this.delta);
      this._title.setTitle(this.deltaFormated.slice(0, this.deltaFormated.length - 4));
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
    this.deltaFormated = this._formatPipe.transform(this.delta);
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
}
