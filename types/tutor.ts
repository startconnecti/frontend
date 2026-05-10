import { User } from './user';

export type TutorApprovalStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export interface Tutor extends User {
  bio: string;
  subjects: string[];
  hourlyRate: number;
  experience: number;
  rating: number;
  totalSessions: number;
  approvalStatus: TutorApprovalStatus;
  submittedAt: string;
}
