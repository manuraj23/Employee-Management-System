import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/model';
import { BehaviorSubject } from 'rxjs';
import { Storage } from './storage';
@Injectable({
  providedIn: 'root',
})
export class Auth {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private storage: Storage, private router: Router) {
    const saved = localStorage.getItem('CURRENT_USER');
    if (saved) this.currentUserSubject.next(JSON.parse(saved));
  }

  login(email: string) {
    const user = this.storage.login(email);
    if (user) {
      localStorage.setItem('CURRENT_USER', JSON.stringify(user));
      this.currentUserSubject.next(user);
      if (user.role === 'HR') this.router.navigate(['/admin']);
      else this.router.navigate(['/user']);
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem('CURRENT_USER');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
