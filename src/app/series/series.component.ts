import { Component, HostListener, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { formatTimeToTimer } from '../helper';
import { ITimer } from '../interfaces';

interface IInterval {
  index: number;
  start: number;
  end: number;
  isSerie: boolean;
}

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
  public seriesFormated: ITimer;
  public pausesFormated: ITimer;
  public runningSeriesFormated: ITimer;
  public runningPausesFormated: ITimer;

  public initialSeriesFormated: ITimer = {
    h: null,
    m: '00',
    s: '45',
    ms: '00',
  };
  public initialPausesFormated: ITimer = {
    h: null,
    m: '01',
    s: '30',
    ms: '00',
  };

  public series: number = 3;
  public lastResume: number;
  public pastTime: number;
  public withArrows: boolean = true;

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
    this.withArrows = false;
    const intervals = this.getIntervals();

    this.interval = setInterval(() => {
      this.delta = Date.now() - this.lastResume + this.pastTime;

      this.deltaFormated = formatTimeToTimer(this.delta);
      this._title.setTitle(`${this.deltaFormated.h} : ${this.deltaFormated.m} : ${this.deltaFormated.s}`);

      let currentInterval: IInterval;

      for (const i of intervals) {
        if (i.start <= this.delta && i.end >= this.delta) {
          currentInterval = i;
        }
      }

      if (currentInterval) {
        if (currentInterval.isSerie) {
          this.runningSeriesFormated = formatTimeToTimer(
            this._initialSeriesTime - (this.delta - (currentInterval.index * (this._initialSeriesTime + this._initialPausesTime)))
          );
          this.runningPausesFormated = null;
        } else {
          this.runningPausesFormated = formatTimeToTimer(
            this._initialPausesTime - (this.delta - ((currentInterval.index + 1) * this._initialSeriesTime + currentInterval.index * this._initialPausesTime))
          );
          this.runningSeriesFormated = null;
        }
      } else {
        this.clear();
      }

      let toTest = this.seriesArray;

      for (const item of toTest) {
        const endSerieTime = ((item + 1) * this._seriesTime + item * this._pausesTime);
        const endPauseTime = item !== toTest.length - 1 ? (endSerieTime + this._pausesTime) : 0;

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
    this.withArrows = true;
    this.seriesFormated = this.initialSeriesFormated;
    this.pausesFormated = this.initialPausesFormated;
    this.runningSeriesFormated = null;
    this.runningPausesFormated = null;
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

  public get seriesArray(): number[] {
    return Array.apply(null, Array(this.series)).map((_, i) => i);
  }

  public get currentWidth(): number {
    return 100 * Math.min(this.delta / (this.series * this._seriesTime + (this.series - 1) * this._pausesTime), 1);
  }

  public get seriesWidth(): number {
    return 100 * this._seriesTime / (this.series * this._seriesTime + (this.series - 1) * this._pausesTime);
  }

  public get pausesWidth(): number {
    return 100 * this._pausesTime / (this.series * this._seriesTime + (this.series - 1) * this._pausesTime);
  }

  public getIntervals(): IInterval[] {
    const intervals = [];
    let time = 0;

    for (const i of this.seriesArray) {
      const serieInterval: IInterval = {
        index: i,
        start: 0,
        end: 0,
        isSerie: true,
      };
      serieInterval.start = time;
      time += this._initialSeriesTime;
      serieInterval.end = time;
      intervals.push(serieInterval);

      if (i !== this.seriesArray.length - 1) {
        const pauseInterval: IInterval = {
          index: i,
          start: time,
          end: 0,
          isSerie: false,
        };
        time += this._initialPausesTime;
        pauseInterval.end = time;
        intervals.push(pauseInterval);
      }
    }

    return intervals;
  }

  public setInitialSeries(): void {
    this.initialSeriesFormated = this.seriesFormated;
  }

  public setInitialPauses(): void {
    this.initialPausesFormated = this.pausesFormated;
  }

  private get _seriesTime(): number {
    return this._getTimeFromTimer(this.seriesFormated);
  }

  private get _pausesTime(): number {
    return this._getTimeFromTimer(this.pausesFormated);
  }

  private get _initialSeriesTime(): number {
    return this._getTimeFromTimer(this.initialSeriesFormated);
  }

  private get _initialPausesTime(): number {
    return this._getTimeFromTimer(this.initialPausesFormated);
  }

  private _getTimeFromTimer(
    timer: ITimer,
  ): number {
    let s = +timer.s;
    let m = +timer.m;
    let ms = +timer.ms;

    return 60000 * m + 1000 * s + ms * 10;
  }
}
