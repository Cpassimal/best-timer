import { Component, Input, Output, EventEmitter } from '@angular/core';

import { formatTimes } from '../helper';
import { TimerPart, TimerPartType } from '../interfaces';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
})
export class TimerComponent {
  @Input()
  public timerParts: TimerPart[];

  @Input()
  public small: boolean = false;

  @Input()
  public isPaused: boolean = false;

  @Input()
  public isStart: boolean = false;

  @Output()
  public onTimerChange = new EventEmitter<void>();

  public onMouseWheel(
    timerPart: TimerPart,
    event: Event,
  ): void {
    if (!timerPart.isEditable || !this.isPaused) {
      return;
    }

    const current = +timerPart.value;

    const direction = (event as any).deltaY < 0 ? 'up' : 'down';

    switch (direction) {
      case 'up': {
        switch (timerPart.type) {
          case TimerPartType.ms: {
            timerPart.value = current < 99 ? formatTimes(current + 1) : formatTimes(0);

            break;
          }
          default: {
            timerPart.value = current < 59 ? formatTimes(current + 1) : formatTimes(0);
          }
        }

        break;
      }
      case 'down': {
        switch (timerPart.type) {
          case TimerPartType.ms: {
            timerPart.value = current > 0 ? formatTimes(current - 1) : formatTimes(99);

            break;
          }
          default: {
            timerPart.value = current > 0 ? formatTimes(current - 1) : formatTimes(59);
          }
        }

        break;
      }
    }

    this.onTimerChange.emit();
  }

  public isLastToShow(timerPart: TimerPart): boolean {
    const lastToShow = this.timerParts
    .filter(t => !t.hide)
    .pop();

    return lastToShow.type === timerPart.type;
  }
}
