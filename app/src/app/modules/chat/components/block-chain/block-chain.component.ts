import { Component, OnInit } from '@angular/core';
import { Auth } from 'src/app/modules/shared/models/auth';
import { ChathttpService } from '../../services/chathttp.service';

@Component({
  selector: 'app-block-chain',
  templateUrl: './block-chain.component.html',
  styleUrls: ['./block-chain.component.sass']
})
export class BlockChainComponent implements OnInit {

  messages = [];
  constructor(private httpService: ChathttpService) { }

  ngOnInit(): void {
    this.getAllMessages();
  }

  getAllMessages() {
    let send = Object.assign({
      userid: Auth.getUserId()
    });

    this.httpService.getAllBlockChain(send).subscribe(
      res => {
        if (res.type == 'success') {
          this.messages = res.result.map((el) => {
            el.createdAt = new Date(el.createdAt).getTime();
            console.log(new Date(el.createdAt).getTime());
            
            return el
          });
        }
      },
      error => {
        console.log(error);

      }
    )


  }

}
