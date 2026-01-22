export enum UserRole {
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  PARENT = 'PARENT',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  bio?: string;
}

export interface Subject {
  id: string;
  name: string;
  teacherId: string;
  schedule: string; // e.g., "Mon, Wed 10:00 AM"
  room: string;
  gradeLevel: number;
}

export interface Lesson {
  id: string;
  subjectId: string;
  date: string; // YYYY-MM-DD
  topic: string;
  homeworkId?: string;
  status: 'PLANNED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
}

export interface Grade {
  id: string;
  studentId: string;
  subjectId: string;
  score: number; // 0-100
  maxScore: number;
  type: 'HOMEWORK' | 'EXAM' | 'QUIZ' | 'PROJECT';
  title?: string; // Optional title for the specific grade entry
  date: string;
  feedback?: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  subjectId: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
}

export interface Assignment {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  assignedDate: string;
  dueDate: string;
  status: 'OPEN' | 'CLOSED';
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'GRADE' | 'ASSIGNMENT' | 'SYSTEM';
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Student extends User {
  gradeLevel: number;
  parentId?: string;
}

export interface ClassStats {
  averageGrade: number;
  attendanceRate: number;
  studentCount: number;
}