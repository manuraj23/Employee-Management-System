import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Auth } from '../services/auth';
import { Storage } from '../services/storage';
import { WorkRequest } from '../models/model';

@Component({
  selector: 'app-hr',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hr.html',
  styleUrls: ['./hr.css']
})
export class Hr implements OnInit {
  requests: WorkRequest[] = [];

  constructor(private storage: Storage, private auth: Auth) {}

  ngOnInit() {
    this.refresh();
  }

  get pendingCount() {
    return this.requests.filter(r => r.status === 'PENDING').length;
  }

  get totalRequests() {
    return this.requests.length;
  }

  refresh() {
    this.requests = this.storage.getRequests().sort((a, b) => {
      const aPending = a.status === 'PENDING';
      const bPending = b.status === 'PENDING';
      return aPending === bPending ? 0 : aPending ? -1 : 1;
    });
  }

  action(id: number, status: 'APPROVED' | 'REJECTED') {
    this.storage.updateRequestStatus(id, status);
    this.refresh();
  }

  logout() {
    this.auth.logout();
  }
}
