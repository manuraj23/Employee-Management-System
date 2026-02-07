import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Auth } from '../services/auth';
import { Storage } from '../services/storage';
import { User, WorkRequest, Project, AttendanceRecord, RequestType } from '../models/model';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user.html',
  styleUrls: ['./user.css']
})
export class UserComponent implements OnInit {

  user: User | null = null;
  projects: Project[] = [];
  attendance: AttendanceRecord[] = [];
  myRequests: WorkRequest[] = [];

  newRequest: { type: RequestType; startDate: string; endDate: string; reason: string } = {
    type: 'LEAVE',
    startDate: '',
    endDate: '',
    reason: ''
  };

  constructor(
    private auth: Auth,
    private storage: Storage
  ) {}

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
    if (!this.user || !this.newRequest.startDate) return;

    this.storage.createRequest({
      userId: this.user.id,
      userName: this.user.name,
      ...this.newRequest
    });

    alert('Request Submitted!');
    this.refreshData();

    this.newRequest = {
      type: 'LEAVE',
      startDate: '',
      endDate: '',
      reason: ''
    };
  }

  cancelRequest(id: number) {
    this.storage.updateRequestStatus(id, 'REJECTED');
    this.refreshData();
  }

  logout() {
    this.auth.logout();
  }
}
