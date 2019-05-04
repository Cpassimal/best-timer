import { Component, HostListener, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { formatTimes } from '../helper';
import { ITimer } from '../interfaces';

const INTERVAL = 10; // ms
const TITLE = 'Timer';

@Component({
  selector: 'app-chrono',
  templateUrl: './chronometer.component.html',
  styleUrls: ['./chronometer.component.scss'],
})
export class ChronometerComponent implements OnDestroy {
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

  private _formatTime(value: number): ITimer {
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
}
