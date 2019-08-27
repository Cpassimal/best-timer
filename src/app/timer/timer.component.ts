import { Component, Input, Output, EventEmitter } from '@angular/core';

import { formatTimes } from '../helper';
import { ITimer } from '../interfaces';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
})
export class TimerComponent {
  @Input()
  public timer: ITimer;

  @Input()
  public withArrows: boolean = false;

  @Input()
  public small: boolean = false;

  @Input()
  public withH: boolean = true;

  @Input()
  public withM: boolean = true;

  @Input()
  public withS: boolean = true;

  @Input()
  public withMs: boolean = true;

  @Output()
  public onTimerChange: EventEmitter<ITimer> = new EventEmitter();

  public onArrowClick(
    type: 'up' | 'down',
    part: 'h' | 'm' | 's' | 'ms',
  ): void {
    const current = +this.timer[part];

    switch (type) {
      case 'up': {
        switch (part) {
          case 'ms': {
            this.timer[part] = current < 99 ? formatTimes(current + 1) : formatTimes(0);

            break;
          }
          default: {
            this.timer[part] = current < 59 ? formatTimes(current + 1) : formatTimes(0);
          }
        }

        break;
      }
      case 'down': {
        switch (part) {
          case 'ms': {
            this.timer[part] = current > 0 ? formatTimes(current - 1) : formatTimes(99);

            break;
          }
          default: {
            this.timer[part] = current > 0 ? formatTimes(current - 1) : formatTimes(59);
          }
        }

        break;
      }
    }

    this.onTimerChange.emit(this.timer);
  }
}
