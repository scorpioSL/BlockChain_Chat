import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ContactListComponent } from './components/contact-list/contact-list.component';
import { ChatComponent } from './components/chat/chat.component';
import { BlockChainComponent } from './components/block-chain/block-chain.component';
import { ChatLayoutComponent } from './components/chat-layout/chat-layout.component';

@NgModule({
  declarations: [
    ContactListComponent,
    ChatComponent,
    BlockChainComponent,
    ChatLayoutComponent,
  ],
  imports: [CommonModule, ChatRoutingModule, SharedModule],
})
export class ChatModule {}
