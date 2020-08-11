import { Component, OnInit } from '@angular/core';
import { ChathttpService } from '../../services/chathttp.service';
import { Auth } from 'src/app/modules/shared/models/auth';
import { SocketserviceService } from '../../services/socketservice.service';
import { MessageModel } from '../../models/message-model';
import { ToastrService } from 'ngx-toastr';

declare const $: any;
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.sass'],
})
export class ChatComponent implements OnInit {
  keyword = 'email';
  data = [];
  ContactList = [];
  Messages = [];
  SelectedRoom: any = {
    person: {},
  };

  UserId = null;

  newMessage: MessageModel = null;
  constructor(
    private chatHttpService: ChathttpService,
    private socketService: SocketserviceService,
    private toaster: ToastrService
  ) { }

  ngOnInit(): void {
    $(document).ready(function () {
      $('#action_menu_btn').click(function () {
        $('.action_menu').toggle();
      });
    });

    this.setOnline();

    this.getAllUsers();
    this.getContactList();
    this.getNewMessage();

    this.UserId = Auth.getUserId();

    this.socketService.getMessage().subscribe((msg: any) => {
      this.playAudio();
      console.log(msg);
      console.log(this.ContactList);

      if (this.ContactList.length > 0) {
        this.ContactList.forEach(element => {
          if (element.room_id == msg.room.room_id) {
            element.newMessage = true;
          }
        });
      }

      if (this.SelectedRoom.room_id == undefined) {
        return;
      }




      if (msg.room.room_id == this.SelectedRoom.room_id) {
        this.Messages.push(msg);
      }
    });

    this.socketService.newContactReceive().subscribe(() => {
      this.toaster.success("You have been added as a new contact from a user");
      this.getContactList();
    });
  }

  selectEvent(item) {
    let check = this.ContactList.find((val) => {
      return val.person._id == item._id;
    });
    if (check == undefined) {
      let addContact = Object.assign({
        contact: item,
        uid: Auth.getUserId(),
        email: Auth.getEmail(),
      });

      this.chatHttpService.addToContact(addContact).subscribe(
        (res) => {
          this.ContactList.push({
            person: res.obj.receiver,
            public_key: res.obj.public_key,
            private_key: res.obj.private_key,
          });
          this.socketService.addNewContact(item);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocused(e) {
    // do something when input is focused
  }

  getAllUsers() {
    this.chatHttpService.getUsers().subscribe(
      (res) => {
        if (res.type == 'success') {
          this.data = res.results.filter((item) => {
            return item._id !== Auth.getUserId();
          });
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getContactList() {
    let sendObject = Object.assign({
      uid: Auth.getUserId(),
    });

    this.chatHttpService.getContactList(sendObject).subscribe(
      (res) => {
        if (res.type == 'success') {
          this.ContactList = res.result.map((item) => {
            return {
              person: item.receiver,
              public_key: item.public_key,
              private_key: item.private_key,
              room_id: item.room_id,
            };
          });

          this.ContactList = this.ContactList.concat(
            res.result.map((item) => {
              return {
                person: item.owner,
                public_key: item.public_key,
                private_key: item.private_key,
                room_id: item.room_id,
              };
            })
          );
          this.ContactList = this.ContactList.filter((item) => {
            return item.person._id !== Auth.getUserId();
          });

          console.log(this.ContactList, 'contact');
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  selectRoom(index) {
    this.ContactList[index].newMessage = false;
    this.SelectedRoom = this.ContactList[index];
    let Send = Object.assign({
      room_id1: Auth.getUserId() + this.SelectedRoom.person._id,
      room_id2: this.SelectedRoom.person._id + Auth.getUserId(),
      userid: Auth.getUserId()
    });

    this.chatHttpService.getMessages(Send).subscribe(
      res => {
        if (res.result != undefined) {
          this.Messages = res.result;
        }
      },
      error => {
        console.log(error);

      }
    );
  }

  getMessages() {
    this.Messages = [];
  }

  setOnline() {
    setTimeout(() => {
      let sendObject = Object.assign({
        uid: Auth.getUserId(),
      });
      this.socketService.setOnlineStatus(sendObject);
    }, 2000);
  }

  getNewMessage() {
    this.newMessage = new MessageModel();
  }

  sendMessage() {
    if (this.SelectedRoom.person._id == undefined) {
      this.toaster.error('Please select a contact');
      return;
    }
    this.newMessage.to = this.SelectedRoom.person._id;
    this.newMessage.uid = Auth.getUserId();
    this.newMessage.createdAt = new Date();
    this.socketService.sendMessage(this.newMessage);
    this.Messages.push(this.newMessage);
    this.getNewMessage();
  }

  playAudio() {
    let audio = new Audio();
    audio.src = "./assets/mp3/juntos.mp3";
    audio.load();
    audio.play();
  }
}
