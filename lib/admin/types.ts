// User and Auth Types
export type UserRole = 'student' | 'tutor' | 'admin';
export type UserStatus = 'active' | 'blocked' | 'suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  phone?: string;
  createdAt: string;
  lastLogin?: string;
}

// Tutor Types
export type TutorApprovalStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export interface Tutor extends User {
  bio: string;
  subjects: string[];
  hourlyRate: number;
  experience: number;
  rating: number;
  totalSessions: number;
  certificates: Certificate[];
  approvalStatus: TutorApprovalStatus;
  submittedAt: string;
  approvedAt?: string;
  rejectionReason?: string;
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  url: string;
  uploadedAt: string;
}

// Booking Types
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'processing' | 'succeeded' | 'failed' | 'cancelled' | 'refunded';

export interface Booking {
  id: string;
  studentId: string;
  tutorId: string;
  subject: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  amount: number;
  createdAt: string;
}

// Session Types
export type SessionStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled';

export interface Session {
  id: string;
  bookingId: string;
  studentId: string;
  tutorId: string;
  subject: string;
  startTime: string;
  endTime: string;
  status: SessionStatus;
  joinLink?: string;
  recordingUrl?: string;
  feedback?: string;
  createdAt: string;
}

// Payment Types
export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: string;
  studentId: string;
  tutorId: string;
  createdAt: string;
  paidAt?: string;
  transactionId?: string;
}

// Refund Types
export type RefundStatus = 'pending' | 'approved' | 'rejected' | 'processed';
export type RefundReason = 'session_cancelled' | 'poor_quality' | 'student_request' | 'other';

export interface Refund {
  id: string;
  paymentId: string;
  amount: number;
  status: RefundStatus;
  reason: RefundReason;
  studentId: string;
  requestedAt: string;
  processedAt?: string;
  note?: string;
}

// Dispute Types
export type DisputeStatus = 'open' | 'under_review' | 'resolved';
export type DisputePriority = 'low' | 'medium' | 'high';
export type DisputeResolution = 'favor_student' | 'favor_tutor' | 'no_refund' | 'partial_refund';

export interface Dispute {
  id: string;
  studentId: string;
  tutorId: string;
  bookingId?: string;
  sessionId?: string;
  status: DisputeStatus;
  priority: DisputePriority;
  subject: string;
  description: string;
  resolution?: DisputeResolution;
  createdAt: string;
  resolvedAt?: string;
}

// Subject Types
export interface Subject {
  id: string;
  name: string;
  slug: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

// Admin Types
export type AdminRole = 'super_admin' | 'operations_admin' | 'finance_admin' | 'support_admin';

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: 'active' | 'inactive';
  createdAt: string;
}

export type PermissionGroup = 'users' | 'tutors' | 'bookings' | 'sessions' | 'payments' | 'refunds' | 'disputes' | 'subjects' | 'admins';
export type Permission = 'create' | 'read' | 'update' | 'delete' | 'approve' | 'reject';

export interface Role {
  id: string;
  name: AdminRole;
  permissions: Record<PermissionGroup, Permission[]>;
}
