import { Component, HostListener, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { formatTimeToTimer } from '../helper';
import { ITimer } from '../interfaces';

const INTERVAL = 10; // ms
const TITLE = 'Timer';

@Component({
  selector: 'app-chrono',
  templateUrl: './chronometer.component.html',
  styleUrls: ['./chronometer.component.scss'],
})
export class ChronometerComponent implements OnDestroy {
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
      this.deltaFormated = formatTimeToTimer(this.delta);
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
    this.pastTime = 0;
    this.delta = 0;
    this.deltaFormated = formatTimeToTimer(this.delta);
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
    this.clear();
  }
}
