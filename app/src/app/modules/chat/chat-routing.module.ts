import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlockChainComponent } from './components/block-chain/block-chain.component';
import { ChatComponent } from './components/chat/chat.component';

const routes: Routes = [
  {
    path: 'chat',
    component: ChatComponent,
  },
  {
    path: 'block-chain',
    component: BlockChainComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatRoutingModule {}
