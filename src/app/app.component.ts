import { Component } from '@angular/core';

import { ChatService } from './chat/chat.service';
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public isChatActive$: BehaviorSubject<boolean>;

  constructor(
    private _chatService: ChatService,
  ) {
    this.isChatActive$ = this._chatService.isActive$;
  }
}
