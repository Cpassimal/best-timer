import { Component, HostListener, OnDestroy } from '@angular/core';
import { DEFAULT_TIMER_PARTS, INTERVAL, TimerPart, TimerPartType, TITLE } from '../interfaces';
import { Title } from '@angular/platform-browser';
import { formatTimerToTime, getTitle, setTimerPartsValues } from '../helper';

interface Step {
  id: number;
  value: number;
  isDone: boolean;
  isNext: boolean;
}

const PYRAMID_DEFAULT = [...DEFAULT_TIMER_PARTS]
.map((p) => ({ ...p, isEditable: p.type !== TimerPartType.ms, hide: p.type === TimerPartType.h }));

@Component({
  selector: 'app-pyramid',
  templateUrl: './pyramid.component.html',
  styleUrls: ['./pyramid.component.scss'],
})
export class PyramidComponent implements OnDestroy {
  public delta: number;
  public timerParts: TimerPart[] = [...PYRAMID_DEFAULT];
  public lastResume: number;
  public pastTime: number;

  public isPaused: boolean = true;
  public isStart: boolean = true;
  public interval: number;
  public focus: boolean = false;

  public initialTime: number = 0;

  public steps: Step[] = [];

  private _numberOfSteps: number;
  private _isRoundTrip: boolean = false;
  private _canMarkStepAsDone: boolean = false;

  public set numberOfSteps(numberOfSteps: number) {
    this._numberOfSteps = numberOfSteps;

    this.steps = this.getSteps();
  }

  public get numberOfSteps(): number {
    return this._numberOfSteps;
  }

  public set isRoundTrip(isRoundTrip: boolean) {
    this._isRoundTrip = isRoundTrip;

    this.steps = this.getSteps();
  }

  public get isRoundTrip(): boolean {
    return this._isRoundTrip;
  }

  constructor(
    private _title: Title,
  ) {
    this.numberOfSteps = 5;
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

    if (this.isStart) {
      this._markStepAsDone(this.steps[0]);
    } else if (this._canMarkStepAsDone) {
      const currentStep = this.steps.find((s) => !s.isDone);
      this._markStepAsDone(currentStep);
      this._canMarkStepAsDone = false;
    }

    this.lastResume = Date.now();

    this.interval = setInterval(() => {
      this.delta = this.initialTime - (Date.now() - this.lastResume + this.pastTime);

      if (this.delta <= 0) {
        this._handleEndStep();
        this._canMarkStepAsDone = true;
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
    if (this.focus) {
      return;
    }

    if (this.isStart) {
      this.initialTime = 0;
    }

    this.pause();
    this.isStart = true;
    this.isPaused = true;
    this.resetTimer();
    this._clearSteps();
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

  public getSteps(): Step[] {
    const steps: Step[] = [];
    let id = 0;

    for (let i = 0; i < this._numberOfSteps; i++) {
      id++;

      steps.push({
        id,
        isDone: false,
        isNext: i === 0,
        value: i + 1,
      });
    }

    if (this._isRoundTrip) {
      for (let i = this._numberOfSteps - 1; i >= 1; i--) {
        id++;

        steps.push({
          id,
          isDone: false,
          isNext: false,
          value: i,
        });
      }
    }

    return steps;
  }

  public trackByStep(index: number, step: Step): number {
    return step.id;
  }

  public getTotal(): number {
    const oneWay = (this._numberOfSteps * (this._numberOfSteps + 1)) / 2;

    if (this._isRoundTrip) {
      return oneWay * 2 - this._numberOfSteps;
    }

    return oneWay;
  }

  public toggleRoundTrip(): void {
    this.isRoundTrip = !this._isRoundTrip;
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

  private _handleEndStep(): void {
    this.pause();
    this.isPaused = true;
    this.resetTimer();

    if (this.steps.every((s) => s.isDone)) {
      this._clearSteps();
      this.isStart = true;
    }
  }

  private _clearSteps(): void {
    if (!this.steps.length) {
      return;
    }

    for (const step of this.steps) {
      step.isDone = false;
      step.isNext = false;
    }

    this.steps[0].isNext = true;
  }

  private _markStepAsDone(step: Step): void {
    step.isNext = false;
    step.isDone = true;

    if (this.steps.every((s) => s.isDone)) {
      return;
    }

    const nextStep = this.steps.find((s) => !s.isDone);

    nextStep.isNext = true;
  }
}
