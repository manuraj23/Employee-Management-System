import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Auth} from '../services/auth';
import { Storage } from '../services/storage';
import { User, WorkRequest, Project, AttendanceRecord } from '../models/model';
@Component({
  selector: 'app-user',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard">
      <header>
        <h1>👋 Welcome, {{ user?.name }}</h1>
        <button (click)="logout()" class="logout-btn">Logout</button>
      </header>

      <div class="grid-container">
        <div class="card profile">
          <h3>My Profile</h3>
          <p><strong>Dept:</strong> {{ user?.department }}</p>
          <p><strong>Role:</strong> {{ user?.designation }}</p>
          <p><strong>Leave Balance:</strong> {{ user?.leaveBalance }} Days</p>
        </div>

        <div class="card attendance">
          <h3>Recent Attendance</h3>
          <table>
            <tr *ngFor="let rec of attendance">
              <td>{{ rec.date }}</td>
              <td><span class="badge success">{{ rec.status }}</span></td>
              <td>{{ rec.checkIn }} - {{ rec.checkOut }}</td>
            </tr>
          </table>
        </div>

        <div class="card projects">
          <h3>Assigned Projects</h3>
          <div *ngFor="let p of projects" class="project-item">
            <strong>{{ p.name }}</strong>
            <span class="badge info">{{ p.status }}</span>
            <p>{{ p.description }}</p>
          </div>
        </div>

        <div class="card apply-form">
          <h3>Apply for Leave / WFH</h3>
          <div class="form-group">
            <select [(ngModel)]="newRequest.type">
              <option value="LEAVE">Leave</option>
              <option value="WFH">Work From Home</option>
            </select>
            <input type="date" [(ngModel)]="newRequest.startDate" placeholder="Start">
            <input type="date" [(ngModel)]="newRequest.endDate" placeholder="End">
            <input type="text" [(ngModel)]="newRequest.reason" placeholder="Reason">
            <button (click)="submitRequest()">Submit Request</button>
          </div>
        </div>

        <div class="card history full-width">
          <h3>My Request History</h3>
          <table>
            <thead>
              <tr><th>Type</th><th>Dates</th><th>Reason</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              <tr *ngFor="let r of myRequests">
                <td>{{ r.type }}</td>
                <td>{{ r.startDate }} to {{ r.endDate }}</td>
                <td>{{ r.reason }}</td>
                <td>
                  <span [class]="'badge ' + r.status.toLowerCase()">{{ r.status }}</span>
                </td>
                <td>
                  <button *ngIf="r.status === 'PENDING'" (click)="cancelRequest(r.id)" class="btn-cancel">Cancel</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard { padding: 20px; font-family: sans-serif; }
    header { display: flex; justify-content: space-between; margin-bottom: 20px; }
    .grid-container { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .full-width { grid-column: span 2; }
    .card { background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
    table { width: 100%; border-collapse: collapse; }
    td, th { padding: 10px; border-bottom: 1px solid #eee; text-align: left; }
    
    .badge { padding: 4px 8px; border-radius: 12px; font-size: 0.8em; color: white; }
    .badge.success { background: #27ae60; } /* Green */
    .badge.approved { background: #27ae60; }
    .badge.pending { background: #f39c12; } /* Orange */
    .badge.rejected { background: #c0392b; } /* Red */
    .badge.info { background: #2980b9; }

    .form-group input, .form-group select { display: block; width: 95%; margin-bottom: 10px; padding: 8px; }
    button { padding: 8px 15px; cursor: pointer; background: #34495e; color: white; border: none; border-radius: 4px; }
    .btn-cancel { background: #e74c3c; font-size: 0.8rem; }
  `]
})
export class UserComponent {
  user: User | null = null;
  projects: Project[] = [];
  attendance: AttendanceRecord[] = [];
  myRequests: WorkRequest[] = [];

  newRequest: any = { type: 'LEAVE', startDate: '', endDate: '', reason: '' };

  constructor(private auth: Auth, private storage: Storage) {}

  ngOnInit() {
    this.user = this.auth.getCurrentUser();
    if (this.user) {
      this.refreshData();
    }
  }

  refreshData() {
    if (!this.user) return;
    this.projects = this.storage.getUserProjects(this.user.id);
    this.attendance = this.storage.getAttendance(this.user.id);
    this.myRequests = this.storage.getRequests(this.user.id);
  }

  submitRequest() {
    if(this.newRequest.startDate && this.user) {
      this.storage.createRequest({
        userId: this.user.id,
        userName: this.user.name,
        ...this.newRequest
      });
      alert('Request Submitted!');
      this.refreshData();
      // Reset form
      this.newRequest = { type: 'LEAVE', startDate: '', endDate: '', reason: '' };
    }
  }

  cancelRequest(id: number) {
     // For simplicity in this demo, we just treat cancel as a delete or a status update
     // Implementing a 'CANCELLED' status logic here
     this.storage.updateRequestStatus(id, 'REJECTED'); // User cancelling effectively kills it
     this.refreshData();
  }

  logout() { this.auth.logout(); }

}
