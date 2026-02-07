import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  error = '';

  constructor(private auth: Auth) {}

  login(email: string) {
    if (!this.auth.login(email)) {
      this.error = 'User not found in mock DB';
    }
  }
}
