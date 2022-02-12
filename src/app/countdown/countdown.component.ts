import { Component, HostListener, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { formatTimerToTime, getTitle, setTimerPartsValues } from '../helper';
import { DEFAULT_TIMER_PARTS, INTERVAL, TimerPart, TimerPartType, TITLE } from '../interfaces';

const COUNTDOWN_DEFAULT = [...DEFAULT_TIMER_PARTS]
.map((p) => ({ ...p, isEditable: true, hide: p.type === TimerPartType.ms }));

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss'],
})
export class CountdownComponent implements OnDestroy {
  public delta: number;
  public timerParts: TimerPart[] = [...COUNTDOWN_DEFAULT];
  public lastResume: number;
  public pastTime: number;

  public isPaused: boolean = true;
  public isStart: boolean = true;
  public interval: number;

  public isTimeUp: boolean = false;
  public initialTime: number = 0;

  constructor(
    private _title: Title,
  ) {
    this.resetTimer();
  }

  public updateInitialTimer(): void {
    this.initialTime = formatTimerToTime(this.timerParts);
    this.resetTimer();
  }

  public play(): void {
    if (!this.initialTime) {
      return;
    }

    this.lastResume = Date.now();

    this.interval = setInterval(() => {
      this.delta = this.initialTime - (Date.now() - this.lastResume + this.pastTime);

      if (this.delta <= 0) {
        this.isTimeUp = true;
        this.clear();
      } else {
        setTimerPartsValues(this.timerParts, this.delta);
        this._title.setTitle(getTitle(this.timerParts));
      }
    }, INTERVAL);

    this.isStart = false;
  }

  public pause(): void {
    clearInterval(this.interval);
    this.pastTime = this.initialTime - this.delta;
  }

  public togglePause(): void {
    if (!this.initialTime) {
      return;
    }

    if (this.isPaused) {
      this.play();
    } else {
      this.pause();
    }

    this.isPaused = !this.isPaused;
  }

  public clear(): void {
    if (this.isStart) {
      this.initialTime = 0;
    }

    this.pause();
    this.isStart = true;
    this.isPaused = true;
    this.resetTimer();
  }

  public resetTimer(): void {
    this.pastTime = 0;
    this.delta = 0;

    if (this.initialTime) {
      setTimerPartsValues(this.timerParts, this.initialTime);
    } else {
      setTimerPartsValues(this.timerParts, 0);
      this._title.setTitle(TITLE);
    }
  }

  @HostListener('document:keydown', ['$event'])
  public onKeyBoardEvent(event: KeyboardEvent): void {
    if (this.isTimeUp) {
      this.isTimeUp = false;

      return;
    }

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

  @HostListener('document:click')
  public onGlobalClick(): void {
    this.isTimeUp = false;
  }

  public ngOnDestroy(): void {
    this.clear();
  }
}
