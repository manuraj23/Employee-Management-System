import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Auth } from '../services/auth';
import { Storage } from '../services/storage';
import { WorkRequest } from '../models/model';

@Component({
  selector: 'app-hr',
  imports: [CommonModule],
  template: `
    <div class="admin-panel">
      <header>
        <h1>🛡️ HR Admin Dashboard</h1>
        <button (click)="logout()" class="logout-btn">Logout</button>
      </header>

      <div class="stats-row">
        <div class="card stat">
          <h2>{{ pendingCount }}</h2>
          <span>Pending Requests</span>
        </div>
        <div class="card stat">
          <h2>{{ totalRequests }}</h2>
          <span>Total Processed</span>
        </div>
      </div>

      <div class="card request-list">
        <h3>Inbox: Employee Requests</h3>
        
        <div *ngIf="requests.length === 0" class="empty-state">No pending requests.</div>

        <table *ngIf="requests.length > 0">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Type</th>
              <th>Dates</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let r of requests">
              <td><strong>{{ r.userName }}</strong></td>
              <td>{{ r.type }}</td>
              <td>{{ r.startDate }} <br><small>to {{ r.endDate }}</small></td>
              <td>{{ r.reason }}</td>
              <td>
                <span [class]="'badge ' + r.status.toLowerCase()">{{ r.status }}</span>
              </td>
              <td>
                <div *ngIf="r.status === 'PENDING'">
                  <button (click)="action(r.id, 'APPROVED')" class="btn-approve">Approve</button>
                  <button (click)="action(r.id, 'REJECTED')" class="btn-reject">Reject</button>
                </div>
                <div *ngIf="r.status !== 'PENDING'">
                   Done
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .admin-panel { padding: 20px; font-family: 'Segoe UI', sans-serif; background: #f0f2f5; min-height: 100vh; }
    header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
    .logout-btn { background: #333; color: #fff; border:none; padding: 10px 20px; cursor: pointer; border-radius: 4px;}
    
    .stats-row { display: flex; gap: 20px; margin-bottom: 20px; }
    .card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
    .stat { flex: 1; text-align: center; }
    .stat h2 { font-size: 2.5em; color: #6c5ce7; margin: 0; }
    
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th { text-align: left; color: #777; font-weight: 600; padding: 10px; border-bottom: 2px solid #eee; }
    td { padding: 15px 10px; border-bottom: 1px solid #eee; vertical-align: middle; }
    
    .badge { padding: 5px 10px; border-radius: 15px; font-size: 0.85em; font-weight: bold; color: white;}
    .badge.pending { background: #f1c40f; color: #333; }
    .badge.approved { background: #2ecc71; }
    .badge.rejected { background: #e74c3c; }

    button { margin-right: 5px; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; color: white; font-weight: bold; }
    .btn-approve { background: #2ecc71; }
    .btn-reject { background: #e74c3c; }
    .empty-state { text-align: center; color: #999; padding: 20px; }
  `]
})
export class Hr implements OnInit {
requests: WorkRequest[] = [];

  constructor(private storage: Storage, private auth: Auth) {}

  ngOnInit() {
    this.refresh();
  }

  get pendingCount() { return this.requests.filter(r => r.status === 'PENDING').length; }
  get totalRequests() { return this.requests.length; }

  refresh() {
    // Get ALL requests for HR
    this.requests = this.storage.getRequests().sort((a, b) => {
      // Sort pending first
      const aPending = a.status === 'PENDING';
      const bPending = b.status === 'PENDING';
      return aPending === bPending ? 0 : aPending ? -1 : 1;
    });
  }

  action(id: number, status: 'APPROVED' | 'REJECTED') {
    this.storage.updateRequestStatus(id, status);
    this.refresh();
  }

  logout() { this.auth.logout(); }
}
