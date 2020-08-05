import { Component, OnInit } from '@angular/core';
import { Auth } from '../modules/shared/models/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass'],
})
export class HomeComponent implements OnInit {
  ShowSecurityRoutes = true;

  constructor(private router:Router) {}

  ngOnInit(): void {
    if (Auth.getUserId() != null) {
      this.ShowSecurityRoutes = false;
    }
  }

  logout(){
    Auth.emptyAuth();
    this.router.navigate(['/login']);
  }
}
