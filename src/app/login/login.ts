import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Auth } from '../services/auth';
@Component({
  selector: 'app-login',
  imports: [CommonModule],
  template: `
    <div class="login-container">
      <div class="card">
        <h2>EMS Portal</h2>
        <p>Select a persona to simulate login:</p>
        <button (click)="login('hr@ems.com')" class="btn-hr">Login as HR (Alice)</button>
        <button (click)="login('user@ems.com')" class="btn-emp">Login as Employee (Bob)</button>
        
        <div *ngIf="error" class="error">{{ error }}</div>
      </div>
    </div>
  `,
  styles: [`
    .login-container { height: 100vh; display: flex; justify-content: center; align-items: center; background: #f4f7f6; }
    .card { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; }
    button { display: block; width: 100%; margin: 10px 0; padding: 10px; border: none; border-radius: 4px; cursor: pointer; color: white; font-weight: bold; }
    .btn-hr { background: #6c5ce7; }
    .btn-emp { background: #00b894; }
    .error { color: red; margin-top: 10px; }
  `]
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
