import { Component, HostListener, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { formatTimes } from '../helper';
import { ITimer } from '../interfaces';

const INTERVAL = 10; // ms
const TITLE = 'Timer';

@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.scss'],
})
export class SeriesComponent implements OnDestroy {
  public delta: number;
  public deltaFormated: ITimer;
  public seriesFormated: ITimer = {
    h: null,
    m: '0',
    s: '04',
    ms: null,
  };
  public pausesFormated: ITimer = {
    h: null,
    m: '0',
    s: '04',
    ms: null,
  };
  public series: number = 3;
  public lastResume: number;
  public pastTime: number;

  public isPaused: boolean = true;
  public isStart: boolean = true;
  public interval: number;

  private _audioHigh = new Audio('assets/high.mp3');
  private _audioLow = new Audio('assets/low.mp3');

  constructor(
    private _title: Title,
  ) {
    this.resetTimer();
  }

  public playSound(
    end: boolean = false
  ): void {
    let count = 1;

    const interval = setInterval(() => {
      count++;

      if (count > (end ? 4 : 2)) {
        this._audioHigh.play();
        clearInterval(interval)

        if (end) {
          let count2 = 1;

          const interval2 = setInterval(() => {
            this._audioHigh.play();
            count2++;

            if (count2 > 2){
              clearInterval(interval2);
            }
          }, 500)
        }
      } else {
        this._audioLow.play();
      }
    }, end ? 500 : 1000);

    this._audioLow.play();
  }

  public play(): void {
    this.lastResume = Date.now();

    this.interval = setInterval(() => {
      this.delta = Date.now() - this.lastResume + this.pastTime;
      this.deltaFormated = this._formatTime(this.delta);
      this._title.setTitle(`${this.deltaFormated.h} : ${this.deltaFormated.m} : ${this.deltaFormated.s}`);
      let toTest = this.seriesArray;

      for (const item of toTest) {
        const endSerieTime = ((item + 1) * this._seriesTime + item * this._pausesTime) * 1000;
        const endPauseTime = item !== toTest.length - 1 ? (endSerieTime + this._pausesTime * 1000) : 0;

        if (Math.abs(this.delta - endSerieTime + 2000) < 2 * INTERVAL || Math.abs(this.delta - endPauseTime + 2000) < 2 * INTERVAL){
          this.playSound(item === toTest.length - 1);

          break;
        }
      }
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

  public get seriesArray(): number[] {
    return Array.apply(null, Array(this.series)).map((_, i) => i);
  }

  public get currentWidth(): number {
    return 100 * Math.min(this.delta / (this.series * this._seriesTime + (this.series - 1) * this._pausesTime) / 1000, 1);
  }

  public get seriesWidth(): number {
    return 100 * this._seriesTime / (this.series * this._seriesTime + (this.series - 1) * this._pausesTime);
  }

  public get pausesWidth(): number {
    return 100 * this._pausesTime / (this.series * this._seriesTime + (this.series - 1) * this._pausesTime);
  }

  private get _seriesTime(): number {
    let s = +this.seriesFormated.s;
    let m = +this.seriesFormated.m;

    return 60 * m + s;
  }

  private get _pausesTime(): number {
    let s = +this.pausesFormated.s;
    let m = +this.pausesFormated.m;

    return 60 * m + s;
  }
}
