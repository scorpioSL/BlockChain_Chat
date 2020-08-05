import { Component, OnInit } from '@angular/core';
import { SignupModel } from '../../models/signup-model';
import { ToastrService } from 'ngx-toastr';
import { SecurityService } from '../../services/security.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.sass'],
})
export class SignInComponent implements OnInit {
  SignUpObject: SignupModel = null;
  ConfirmPassword: string = null;
  constructor(
    private toaster: ToastrService,
    private securityService: SecurityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.SignUpObject = new SignupModel();
  }

  SubmitSignUp() {
    if (
      this.SignUpObject.password == null ||
      this.SignUpObject.password == ''
    ) {
      this.toaster.error('Please provide a valid password!');
      return;
    }

    if (this.SignUpObject.password != this.ConfirmPassword) {
      this.toaster.error('Password fields must match!');
      return;
    }

    this.securityService.RegisterUser(this.SignUpObject).subscribe(
      (res) => {
        console.log(res);
        if (res.type == 'success') {
          this.toaster.success('Successfully registered!');
          this.router.navigate(['/auth/login']);
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
