import { Component, OnInit } from '@angular/core';
import { Login } from '../../models/login';
import { ToastrService } from 'ngx-toastr';
import { SecurityService } from '../../services/security.service';
import { Auth } from '../../../shared/models/auth';
import { Router } from '@angular/router';

declare const $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
})
export class LoginComponent implements OnInit {
  loginObject: Login = null;
  constructor(
    private toaster: ToastrService,
    private securityService: SecurityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    $('.message a').click(function () {
      $('form').animate({ height: 'toggle', opacity: 'toggle' }, 'slow');
    });

    this.loginObject = new Login();
  }

  submitLogin() {
    if (this.loginObject.email == '' || this.loginObject.email == null) {
      this.toaster.error('Please provide a email');
      return;
    }

    if (this.loginObject.password == '' || this.loginObject.password == null) {
      this.toaster.error('Please provide a password');
      return;
    }

    this.securityService.login(this.loginObject).subscribe(
      (res) => {
        if (res.type == 'success') {
          Auth.setUserId(res.obj._id);
          Auth.setEmail(res.obj.email);
          this.router.navigate(['/dashboard/chat']);
        } else {
          this.toaster.error(res.error);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
