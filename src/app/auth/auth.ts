import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  imports: [FormsModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {
  email = '';
  password = '';


  constructor(private router: Router) { }


  login() {
    const users = JSON.parse(localStorage.getItem('users')!);
    const user = users.find((u: any) => u.email === this.email && u.password === this.password);


    if (!user) return alert('Invalid Credentials');


    localStorage.setItem('currentUser', JSON.stringify(user));


    user.role === 'HR'
      ? this.router.navigate(['/hr'])
      : this.router.navigate(['/user']);
  }
}
