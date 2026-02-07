import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
 import { Login } from './login/login';
import { UserComponent } from './user/user';
import { Hr } from './hr/hr';
import { Auth} from './services/auth';
import { inject } from '@angular/core';

// Simple functional guards for Angular 15+
const AuthGuard = () => inject(Auth).getCurrentUser() ? true : false;
const AdminGuard = () => {
  const user = inject(Auth).getCurrentUser();
  return user && user.role === 'HR';
};

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { 
    path: 'user', 
    component: UserComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'admin', 
    component: Hr, 
    canActivate: [AdminGuard] 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }