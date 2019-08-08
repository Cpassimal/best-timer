import { Component } from '@angular/core';

import {ChatService, IMessage} from './chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
  public messages: IMessage[] = [];

  constructor(
    private _chatService: ChatService,
  ) {
    this._chatService.isActive$.next(true);

    this._chatService.socket$.subscribe((content) => {
      this.messages.push(JSON.parse(content.data));
    })
  }

  public send(message: string): void {
    this._chatService.send(message);
  }

  public ngOnDestroy(): void {
    this._chatService.isActive$.next(false);
  }
}
