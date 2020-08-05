import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    component: HomeComponent,
    loadChildren: () => {
      return import('./modules/security/security.module').then(
        (m) => m.SecurityModule
      );
    },
  },
  {
    path: 'dashboard',
    component: HomeComponent,
    loadChildren: () => {
      return import('./modules/chat/chat.module').then((m) => m.ChatModule);
    },
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
