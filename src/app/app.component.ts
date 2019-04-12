import { Component, HostListener } from '@angular/core';

const INTERVAL = 10; // ms

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public timer: number = 0;
  public isPaused: boolean = true;
  public isStart: boolean = true;
  public interval: number;

  public play(): void {
    this.interval = setInterval(() => {
      this.timer += INTERVAL;
    }, INTERVAL);

    this.isStart = false;
  }

  public pause(): void {
    clearInterval(this.interval);
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
    this.timer = 0;
  }

  @HostListener('document:keydown', ['$event'])
  public onKeyBoardEvent(event: KeyboardEvent): void {
    switch (event.code) {
      case 'Enter':
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
}
