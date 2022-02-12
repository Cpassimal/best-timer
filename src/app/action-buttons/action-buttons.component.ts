import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'action-buttons',
  templateUrl: './action-buttons.component.html',
  styleUrls: ['./action-buttons.component.scss'],
})
export class ActionButtonsComponent {
  @Input()
  public isPaused: boolean = false;

  @Input()
  public isStart: boolean = false;

  @Output()
  public onClear = new EventEmitter<void>();

  @Output()
  public onTogglePause = new EventEmitter<void>();

  public clear(): void {
    this.onClear.emit();
  }

  public togglePause(): void {
    this.onTogglePause.emit();
  }
}
