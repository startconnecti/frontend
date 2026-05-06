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

// Payout Types
export type PayoutStatus = 'pending' | 'processing' | 'paid' | 'failed' | 'cancelled';

export interface Payout {
  id: string;
  tutorId: string;
  amount: number;
  status: PayoutStatus;
  paymentMethod: string;
  requestedAt: string;
  processedAt?: string;
  platformCommission: number;
  grossAmount: number;
  netAmount: number;
  note?: string;
}

// Notification Types
export type NotificationType = 'session_updated' | 'session_reminder' | 'tutor_profile_updated' | 'payment_updated' | 'refund_updated' | 'dispute_updated' | 'system_announcement';

export interface Notification {
  id: string;
  recipientId?: string;
  recipientRole: 'all' | 'student' | 'tutor' | 'admin';
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  relatedResourceId?: string;
  relatedResourceType?: string;
  createdAt: string;
}

// Conversation & Message Types
export type ConversationStatus = 'active' | 'archived' | 'reported' | 'closed';

export interface Participant {
  userId: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderAvatar?: string;
  content: string;
  attachments?: string[];
  createdAt: string;
}

export interface Conversation {
  id: string;
  participants: Participant[];
  lastMessage?: Message;
  status: ConversationStatus;
  relatedBookingId?: string;
  relatedSessionId?: string;
  createdAt: string;
  lastActivityAt: string;
}

// Audit Log Types
export type AuditAction = 'create' | 'read' | 'update' | 'delete' | 'approve' | 'reject' | 'block' | 'unblock' | 'login' | 'logout';
export type AuditEntityType = 'user' | 'tutor' | 'booking' | 'session' | 'payment' | 'refund' | 'dispute' | 'subject' | 'admin' | 'role';

export interface AuditLog {
  id: string;
  actorId: string;
  actorEmail: string;
  action: AuditAction;
  entityType: AuditEntityType;
  entityId: string;
  ipAddress: string;
  userAgent: string;
  beforeValue?: Record<string, any>;
  afterValue?: Record<string, any>;
  createdAt: string;
}

// System Settings Types
export interface SystemSettings {
  general: {
    platformName: string;
    supportEmail: string;
    maintenanceMode: boolean;
  };
  booking: {
    holdDuration: number;
    cancellationWindow: number;
    allowTutorCancellation: boolean;
    allowStudentCancellation: boolean;
  };
  payment: {
    paymentGateway: string;
    bankTransferInfo: string;
    expirationTime: number;
  };
  commission: {
    platformCommissionPercentage: number;
    tutorPayoutHoldDuration: number;
    minimumPayoutAmount: number;
  };
  notification: {
    emailNotifications: boolean;
    sessionReminderTime: number;
    systemAnnouncement: boolean;
  };
  security: {
    adminSessionDuration: number;
    passwordMinLength: number;
    requireStrongPassword: boolean;
  };
}
