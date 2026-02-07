import { Injectable } from '@angular/core';
import { User, WorkRequest, Project, AttendanceRecord } from '../models/model';
import { BehaviorSubject, Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class Storage {
  private readonly DATA_KEY = 'EMS_DATA_V1';

  // Seed Data
  private initialData = {
    users: [
      { id: 1, name: 'Alice HR', email: 'hr@ems.com', role: 'HR', department: 'Operations', designation: 'HR Manager', joinDate: new Date(), leaveBalance: 20 },
      { id: 2, name: 'Bob Dev', email: 'user@ems.com', role: 'USER', department: 'Engineering', designation: 'Frontend Dev', joinDate: new Date(), leaveBalance: 12 }
    ],
    requests: [],
    projects: [
      { id: 101, name: 'Project Phoenix', description: 'Revamping the legacy UI', status: 'In Progress', teamMembers: [2] },
      { id: 102, name: 'Gateway API', description: 'Backend microservices', status: 'Delayed', teamMembers: [] }
    ],
    attendance: [
      { userId: 2, date: '2023-10-25', status: 'Present', checkIn: '09:00', checkOut: '18:00' },
      { userId: 2, date: '2023-10-26', status: 'Present', checkIn: '09:15', checkOut: '18:10' }
    ]
  };

  constructor() {
    this.init();
  }

  private init() {
    if (!localStorage.getItem(this.DATA_KEY)) {
      localStorage.setItem(this.DATA_KEY, JSON.stringify(this.initialData));
    }
  }

  private getDb() {
    return JSON.parse(localStorage.getItem(this.DATA_KEY) || '{}');
  }

  private saveDb(data: any) {
    localStorage.setItem(this.DATA_KEY, JSON.stringify(data));
  }

  // --- User Operations ---
  login(email: string): User | undefined {
    const db = this.getDb();
    return db.users.find((u: User) => u.email === email);
  }

  getUser(id: number): User {
    const db = this.getDb();
    return db.users.find((u: User) => u.id === id);
  }

  // --- Request Operations ---
  getRequests(userId?: number): WorkRequest[] {
    const db = this.getDb();
    if (userId) {
      return db.requests.filter((r: WorkRequest) => r.userId === userId);
    }
    return db.requests; // Return all for HR
  }

  createRequest(req: Partial<WorkRequest>) {
    const db = this.getDb();
    const newReq = {
      ...req,
      id: Date.now(),
      status: 'PENDING',
      requestDate: new Date().toISOString()
    };
    db.requests.push(newReq);
    this.saveDb(db);
  }

  updateRequestStatus(reqId: number, status: 'APPROVED' | 'REJECTED') {
    const db = this.getDb();
    const idx = db.requests.findIndex((r: WorkRequest) => r.id === reqId);
    if (idx > -1) {
      db.requests[idx].status = status;
      this.saveDb(db);
    }
  }

  // --- Project & Attendance ---
  getUserProjects(userId: number): Project[] {
    const db = this.getDb();
    return db.projects.filter((p: Project) => p.teamMembers.includes(userId));
  }

  getAttendance(userId: number): AttendanceRecord[] {
    const db = this.getDb();
    return db.attendance.filter((a: AttendanceRecord) => a.userId === userId);
  }
}
