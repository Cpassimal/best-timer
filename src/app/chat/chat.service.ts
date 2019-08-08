import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, Observer } from 'rxjs';

const SOCKET_URL = 'ws://localhost:8000';

export interface IMessage {
  sender: string;
  content: string;
}

@Injectable()
export class ChatService {
  public isActive$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public socket$: Observable<MessageEvent>;

  private _ws = new WebSocket(SOCKET_URL);

  constructor() {
    this.socket$ = Observable.create((obs: Observer<IMessage>) => {
      this._ws.onmessage = obs.next.bind(obs);
      this._ws.onerror = obs.error.bind(obs);
      this._ws.onclose = obs.complete.bind(obs);
    });
  }

  public send(message: string): void {
    this._ws.send(JSON.stringify({
      sender: "My name",
      content: message,
    }));
  }
}