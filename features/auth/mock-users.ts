import { AuthUser } from './types';

export const MOCK_USERS: (AuthUser & { password?: string })[] = [
  {
    id: 'user_student_1',
    email: 'student@example.com',
    password: 'password123',
    fullName: 'Alex Student',
    role: 'student',
    status: 'active',
  },
  {
    id: 'user_tutor_1',
    email: 'tutor@example.com',
    password: 'password123',
    fullName: 'Dr. Sarah Wilson',
    role: 'tutor',
    status: 'active',
    approvalStatus: 'approved',
  },
  {
    id: 'user_tutor_pending',
    email: 'pending@example.com',
    password: 'password123',
    fullName: 'Peter Pending',
    role: 'tutor',
    status: 'active',
    approvalStatus: 'pending',
  },
  {
    id: 'user_tutor_rejected',
    email: 'rejected@example.com',
    password: 'password123',
    fullName: 'Randy Rejected',
    role: 'tutor',
    status: 'active',
    approvalStatus: 'rejected',
  },
  {
    id: 'user_student_blocked',
    email: 'blocked@example.com',
    password: 'password123',
    fullName: 'Ben Blocked',
    role: 'student',
    status: 'blocked',
  }
];
