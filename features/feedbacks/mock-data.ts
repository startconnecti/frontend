import { Feedback } from './types';

export const MOCK_FEEDBACKS: Feedback[] = [
  {
    id: 'fb-001',
    sessionId: 'sess-001',
    studentId: 'student-001',
    tutorId: 'tutor-001',
    tutorName: 'Dr. Sarah Wilson',
    studentName: 'Alex Johnson',
    subject: 'Physics',
    rating: 5,
    comment: 'Sarah is an amazing tutor! She explained complex quantum mechanics in a very simple way.',
    createdAt: '2024-05-09T14:30:00Z',
  },
  {
    id: 'fb-002',
    sessionId: 'sess-002',
    studentId: 'student-001',
    tutorId: 'tutor-002',
    tutorName: 'James Miller',
    studentName: 'Alex Johnson',
    subject: 'Calculus II',
    rating: 4,
    comment: 'Great session, very helpful with the integration problems.',
    createdAt: '2024-05-08T11:00:00Z',
  },
];
