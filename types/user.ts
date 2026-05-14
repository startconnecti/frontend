import { UserRole } from '@/features/auth/types';

export type UserStatus = 'active' | 'blocked' | 'suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  createdAt: string;
}
