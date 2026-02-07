export type Role = 'HR' | 'USER';
export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type RequestType = 'LEAVE' | 'WFH';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  department: string;
  designation: string;
  joinDate: Date;
  leaveBalance: number;
}

export interface WorkRequest {
  id: number;
  userId: number;
  userName: string
  type: RequestType;
  startDate: string;
  endDate: string;
  reason: string;
  status: RequestStatus;
  requestDate: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  status: 'In Progress' | 'Completed' | 'Delayed';
  teamMembers: number[];
}

export interface AttendanceRecord {
  userId: number;
  date: string;
  status: 'Present' | 'Absent' | 'Half-Day';
  checkIn: string;
  checkOut: string;
}