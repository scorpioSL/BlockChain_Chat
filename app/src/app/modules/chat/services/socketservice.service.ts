import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';
import { MessageModel } from '../models/message-model';

@Injectable({
  providedIn: 'root',
})
export class SocketserviceService {
  constructor(private socket: Socket) { }

  sendMessage(msg: MessageModel) {
    this.socket.emit('message', msg);
  }
  getMessage() {
    return this.socket.fromEvent('newMessage');
  }

  addNewContact(model) {
    this.socket.emit('addNewContact', model);
  }

  newContactReceive() {
    return this.socket.fromEvent('newContact');
  }

  setOnlineStatus(model) {
    this.socket.emit('online', model);
  }
}
