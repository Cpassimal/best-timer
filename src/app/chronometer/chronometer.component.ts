import { Component, HostListener, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { setTimerPartsValues, getTitle } from '../helper';
import { DEFAULT_TIMER_PARTS, INTERVAL, TimerPart, TITLE } from '../interfaces';

@Component({
  selector: 'app-chrono',
  templateUrl: './chronometer.component.html',
  styleUrls: ['./chronometer.component.scss'],
})
export class ChronometerComponent implements OnDestroy {
  public delta: number;
  public timerParts: TimerPart[] = [...DEFAULT_TIMER_PARTS];
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
      setTimerPartsValues(this.timerParts, this.delta);
      this._title.setTitle(getTitle(this.timerParts));
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
    this.pastTime = 0;
    this.delta = 0;
    setTimerPartsValues(this.timerParts, 0);
    this._title.setTitle(TITLE);
  }

  @HostListener('document:keydown', ['$event'])
  public onKeyBoardEvent(event: KeyboardEvent): void {
    switch (event.code) {
      case 'Enter': {
        this.clear();
        this.togglePause();

        break;
      }
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

  public ngOnDestroy(): void {
    this.pause();
  }
}
