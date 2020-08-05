import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SecurityRoutingModule } from './security-routing.module';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { LoginComponent } from './components/login/login.component';
import { SharedModule } from '../shared/shared.module';
import { SecurityService } from './services/security.service';

@NgModule({
  declarations: [SignInComponent, LoginComponent],
  imports: [CommonModule, SecurityRoutingModule, SharedModule],
  providers: [SecurityService],
})
export class SecurityModule {}
