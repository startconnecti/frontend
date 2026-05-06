import type { User, Tutor, Booking, Session, Payment, Refund, Dispute, Subject, Admin, Role } from './types';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    role: 'student',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    createdAt: '2024-01-15',
    lastLogin: '2024-05-03',
  },
  {
    id: 'user-2',
    name: 'James Wilson',
    email: 'james.wilson@example.com',
    role: 'student',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    createdAt: '2024-02-20',
    lastLogin: '2024-05-02',
  },
  {
    id: 'user-3',
    name: 'Maria Garcia',
    email: 'maria.garcia@example.com',
    role: 'tutor',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    createdAt: '2024-01-10',
    lastLogin: '2024-05-04',
  },
  {
    id: 'user-4',
    name: 'Alex Kumar',
    email: 'alex.kumar@example.com',
    role: 'student',
    status: 'blocked',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    createdAt: '2024-03-05',
    lastLogin: '2024-04-20',
  },
];

export const mockTutors: Tutor[] = [
  {
    id: 'tutor-1',
    name: 'Dr. Maria Garcia',
    email: 'maria.garcia@example.com',
    role: 'tutor',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    createdAt: '2024-01-10',
    lastLogin: '2024-05-04',
    bio: 'PhD in Mathematics with 8 years of teaching experience. Specializing in calculus and linear algebra.',
    subjects: ['Mathematics', 'Calculus', 'Linear Algebra'],
    hourlyRate: 50,
    experience: 8,
    rating: 4.9,
    totalSessions: 156,
    certificates: [
      { id: 'cert-1', name: 'PhD Mathematics', issuer: 'Stanford University', url: '#', uploadedAt: '2024-01-10' },
    ],
    approvalStatus: 'approved',
    submittedAt: '2024-01-10',
    approvedAt: '2024-01-15',
  },
  {
    id: 'tutor-2',
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'tutor',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    createdAt: '2024-02-01',
    lastLogin: '2024-05-03',
    bio: 'IELTS instructor with 6 years of experience. Helped 500+ students achieve their target bands.',
    subjects: ['English', 'IELTS', 'TOEFL'],
    hourlyRate: 35,
    experience: 6,
    rating: 4.8,
    totalSessions: 203,
    certificates: [
      { id: 'cert-2', name: 'IELTS Instructor Certification', issuer: 'British Council', url: '#', uploadedAt: '2024-02-01' },
    ],
    approvalStatus: 'approved',
    submittedAt: '2024-02-01',
    approvedAt: '2024-02-10',
  },
  {
    id: 'tutor-3',
    name: 'Emily Chen',
    email: 'emily.chen@example.com',
    role: 'tutor',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    createdAt: '2024-03-15',
    bio: 'MBA graduate specializing in interview preparation and career counseling for business school candidates.',
    subjects: ['MBA', 'Business', 'Interview Prep'],
    hourlyRate: 60,
    experience: 4,
    rating: 4.7,
    totalSessions: 89,
    certificates: [
      { id: 'cert-3', name: 'MBA Harvard', issuer: 'Harvard Business School', url: '#', uploadedAt: '2024-03-15' },
    ],
    approvalStatus: 'pending',
    submittedAt: '2024-04-20',
  },
  {
    id: 'tutor-4',
    name: 'Rajesh Patel',
    email: 'rajesh.patel@example.com',
    role: 'tutor',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh',
    createdAt: '2024-04-01',
    bio: 'GRE and GMAT expert with 95+ percentile background. Proven track record of student success.',
    subjects: ['GRE', 'GMAT', 'Quantitative Reasoning'],
    hourlyRate: 55,
    experience: 5,
    rating: 4.6,
    totalSessions: 127,
    certificates: [
      { id: 'cert-4', name: 'GRE/GMAT Instructor Certification', issuer: 'Test Prep Institute', url: '#', uploadedAt: '2024-04-01' },
    ],
    approvalStatus: 'pending',
    submittedAt: '2024-04-28',
  },
];

export const mockBookings: Booking[] = [
  {
    id: 'booking-1',
    studentId: 'user-1',
    tutorId: 'tutor-1',
    subject: 'Mathematics',
    startTime: '2024-05-10T14:00:00',
    endTime: '2024-05-10T15:00:00',
    status: 'confirmed',
    paymentStatus: 'succeeded',
    amount: 50,
    createdAt: '2024-05-05',
  },
  {
    id: 'booking-2',
    studentId: 'user-2',
    tutorId: 'tutor-2',
    subject: 'English',
    startTime: '2024-05-12T10:00:00',
    endTime: '2024-05-12T11:00:00',
    status: 'pending',
    paymentStatus: 'pending',
    amount: 35,
    createdAt: '2024-05-04',
  },
  {
    id: 'booking-3',
    studentId: 'user-1',
    tutorId: 'tutor-2',
    subject: 'IELTS',
    startTime: '2024-05-15T16:00:00',
    endTime: '2024-05-15T17:00:00',
    status: 'confirmed',
    paymentStatus: 'succeeded',
    amount: 35,
    createdAt: '2024-05-02',
  },
];

export const mockSessions: Session[] = [
  {
    id: 'session-1',
    bookingId: 'booking-1',
    studentId: 'user-1',
    tutorId: 'tutor-1',
    subject: 'Mathematics',
    startTime: '2024-05-10T14:00:00',
    endTime: '2024-05-10T15:00:00',
    status: 'completed',
    joinLink: 'https://zoom.us/j/123456789',
    recordingUrl: 'https://example.com/recording-1',
    feedback: 'Great session! Maria explained the concepts clearly.',
    createdAt: '2024-05-10',
  },
];

export const mockPayments: Payment[] = [
  {
    id: 'payment-1',
    bookingId: 'booking-1',
    amount: 50,
    currency: 'USD',
    status: 'succeeded',
    method: 'card',
    studentId: 'user-1',
    tutorId: 'tutor-1',
    createdAt: '2024-05-05',
    paidAt: '2024-05-05',
    transactionId: 'txn_1234567890',
  },
  {
    id: 'payment-2',
    bookingId: 'booking-2',
    amount: 35,
    currency: 'USD',
    status: 'pending',
    method: 'card',
    studentId: 'user-2',
    tutorId: 'tutor-2',
    createdAt: '2024-05-04',
  },
];

export const mockRefunds: Refund[] = [
  {
    id: 'refund-1',
    paymentId: 'payment-1',
    amount: 25,
    status: 'approved',
    reason: 'session_cancelled',
    studentId: 'user-1',
    requestedAt: '2024-04-30',
    processedAt: '2024-05-02',
    note: 'Partial refund due to session rescheduling.',
  },
];

export const mockDisputes: Dispute[] = [
  {
    id: 'dispute-1',
    studentId: 'user-2',
    tutorId: 'tutor-1',
    bookingId: 'booking-2',
    status: 'open',
    priority: 'high',
    subject: 'Session Quality Issue',
    description: 'The tutor did not show up on time for the scheduled session.',
    createdAt: '2024-05-01',
  },
  {
    id: 'dispute-2',
    studentId: 'user-1',
    tutorId: 'tutor-2',
    bookingId: 'booking-3',
    status: 'under_review',
    priority: 'medium',
    subject: 'Unclear Instructions',
    description: 'The lesson material was not as advertised.',
    createdAt: '2024-04-28',
  },
];

export const mockSubjects: Subject[] = [
  { id: 'subject-1', name: 'Mathematics', slug: 'mathematics', description: 'All levels of mathematics', status: 'active', createdAt: '2024-01-01' },
  { id: 'subject-2', name: 'English', slug: 'english', description: 'English language and literature', status: 'active', createdAt: '2024-01-01' },
  { id: 'subject-3', name: 'IELTS', slug: 'ielts', description: 'IELTS exam preparation', status: 'active', createdAt: '2024-01-01' },
  { id: 'subject-4', name: 'GMAT', slug: 'gmat', description: 'GMAT exam preparation', status: 'active', createdAt: '2024-01-01' },
  { id: 'subject-5', name: 'GRE', slug: 'gre', description: 'GRE exam preparation', status: 'active', createdAt: '2024-01-01' },
];

export const mockAdmins: Admin[] = [
  { id: 'admin-1', name: 'Super Admin', email: 'admin@connecti.com', role: 'super_admin', status: 'active', createdAt: '2024-01-01' },
  { id: 'admin-2', name: 'Operations Lead', email: 'ops@connecti.com', role: 'operations_admin', status: 'active', createdAt: '2024-02-01' },
  { id: 'admin-3', name: 'Finance Manager', email: 'finance@connecti.com', role: 'finance_admin', status: 'active', createdAt: '2024-02-15' },
];

export const mockRoles: Role[] = [
  {
    id: 'role-1',
    name: 'super_admin',
    permissions: {
      users: ['create', 'read', 'update', 'delete'],
      tutors: ['create', 'read', 'update', 'delete', 'approve', 'reject'],
      bookings: ['create', 'read', 'update', 'delete'],
      sessions: ['create', 'read', 'update', 'delete'],
      payments: ['create', 'read', 'update', 'delete'],
      refunds: ['create', 'read', 'update', 'delete', 'approve', 'reject'],
      disputes: ['create', 'read', 'update', 'delete', 'approve', 'reject'],
      subjects: ['create', 'read', 'update', 'delete'],
      admins: ['create', 'read', 'update', 'delete'],
    },
  },
  {
    id: 'role-2',
    name: 'operations_admin',
    permissions: {
      users: ['read', 'update'],
      tutors: ['read', 'approve', 'reject'],
      bookings: ['read', 'update'],
      sessions: ['read'],
      payments: ['read'],
      refunds: ['read', 'approve', 'reject'],
      disputes: ['read', 'update'],
      subjects: ['read', 'create', 'update'],
      admins: ['read'],
    },
  },
  {
    id: 'role-3',
    name: 'finance_admin',
    permissions: {
      users: ['read'],
      tutors: ['read'],
      bookings: ['read'],
      sessions: ['read'],
      payments: ['read', 'update'],
      refunds: ['read', 'update', 'approve', 'reject'],
      disputes: ['read'],
      subjects: ['read'],
      admins: ['read'],
    },
  },
];

// Payout Mock Data
export const mockPayouts = [
  {
    id: 'payout-1',
    tutorId: 'tutor-1',
    amount: 1500.00,
    status: 'pending' as const,
    paymentMethod: 'Bank Transfer',
    requestedAt: '2024-05-01T10:00:00Z',
    platformCommission: 300.00,
    grossAmount: 1800.00,
    netAmount: 1500.00,
    note: 'May payout request',
  },
  {
    id: 'payout-2',
    tutorId: 'tutor-2',
    amount: 2200.00,
    status: 'processing' as const,
    paymentMethod: 'PayPal',
    requestedAt: '2024-04-28T14:30:00Z',
    platformCommission: 440.00,
    grossAmount: 2640.00,
    netAmount: 2200.00,
  },
  {
    id: 'payout-3',
    tutorId: 'tutor-3',
    amount: 1050.00,
    status: 'paid' as const,
    paymentMethod: 'Bank Transfer',
    requestedAt: '2024-04-20T09:15:00Z',
    processedAt: '2024-04-25T15:45:00Z',
    platformCommission: 210.00,
    grossAmount: 1260.00,
    netAmount: 1050.00,
  },
];

// Notification Mock Data
export const mockNotifications = [
  {
    id: 'notif-1',
    recipientId: 'user-1',
    recipientRole: 'tutor' as const,
    type: 'session_reminder' as const,
    title: 'Upcoming Session',
    message: 'You have a session tomorrow at 2:00 PM with John Doe',
    read: false,
    relatedResourceId: 'session-1',
    relatedResourceType: 'session',
    createdAt: '2024-05-15T10:00:00Z',
  },
  {
    id: 'notif-2',
    recipientRole: 'all' as const,
    type: 'system_announcement' as const,
    title: 'Platform Maintenance',
    message: 'Scheduled maintenance on May 20 from 2-4 AM',
    read: false,
    createdAt: '2024-05-15T09:30:00Z',
  },
  {
    id: 'notif-3',
    recipientId: 'user-2',
    recipientRole: 'student' as const,
    type: 'payment_updated' as const,
    title: 'Payment Confirmed',
    message: 'Your payment of $50 has been confirmed',
    read: true,
    relatedResourceId: 'payment-1',
    relatedResourceType: 'payment',
    createdAt: '2024-05-14T15:20:00Z',
  },
];

// Conversation Mock Data
export const mockConversations = [
  {
    id: 'conv-1',
    participants: [
      { userId: 'user-1', name: 'Sarah Ahmed', role: 'student' as const, avatar: 'https://via.placeholder.com/32' },
      { userId: 'tutor-1', name: 'Mike Johnson', role: 'tutor' as const },
    ],
    lastMessage: {
      id: 'msg-5',
      conversationId: 'conv-1',
      senderId: 'tutor-1',
      senderName: 'Mike Johnson',
      senderRole: 'tutor' as const,
      content: 'See you tomorrow at 2 PM!',
      createdAt: '2024-05-15T14:30:00Z',
    },
    status: 'active' as const,
    relatedBookingId: 'booking-1',
    createdAt: '2024-05-10T08:00:00Z',
    lastActivityAt: '2024-05-15T14:30:00Z',
  },
  {
    id: 'conv-2',
    participants: [
      { userId: 'user-3', name: 'Emma Wilson', role: 'student' as const },
      { userId: 'tutor-2', name: 'Dr. Lisa Chen', role: 'tutor' as const },
    ],
    status: 'archived' as const,
    relatedSessionId: 'session-2',
    createdAt: '2024-05-01T10:00:00Z',
    lastActivityAt: '2024-05-08T16:45:00Z',
  },
];

// Messages Mock Data
export const mockMessages = [
  {
    id: 'msg-1',
    conversationId: 'conv-1',
    senderId: 'user-1',
    senderName: 'Sarah Ahmed',
    senderRole: 'student' as const,
    content: 'Hi Mike, I wanted to ask about the Math calculus session',
    createdAt: '2024-05-15T10:00:00Z',
  },
  {
    id: 'msg-2',
    conversationId: 'conv-1',
    senderId: 'tutor-1',
    senderName: 'Mike Johnson',
    senderRole: 'tutor' as const,
    content: 'Of course! I can help you with any specific topics you are struggling with.',
    createdAt: '2024-05-15T10:15:00Z',
  },
  {
    id: 'msg-3',
    conversationId: 'conv-1',
    senderId: 'user-1',
    senderName: 'Sarah Ahmed',
    senderRole: 'student' as const,
    content: 'Great! I need help with derivatives and integrals',
    createdAt: '2024-05-15T10:30:00Z',
  },
];

// Audit Log Mock Data
export const mockAuditLogs = [
  {
    id: 'audit-1',
    actorId: 'admin-1',
    actorEmail: 'admin@connecti.com',
    action: 'approve' as const,
    entityType: 'tutor' as const,
    entityId: 'tutor-1',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    afterValue: { approvalStatus: 'approved' },
    createdAt: '2024-05-15T14:00:00Z',
  },
  {
    id: 'audit-2',
    actorId: 'admin-2',
    actorEmail: 'support@connecti.com',
    action: 'delete' as const,
    entityType: 'booking' as const,
    entityId: 'booking-2',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    createdAt: '2024-05-15T12:30:00Z',
  },
  {
    id: 'audit-3',
    actorId: 'admin-1',
    actorEmail: 'admin@connecti.com',
    action: 'update' as const,
    entityType: 'subject' as const,
    entityId: 'subj-1',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    beforeValue: { name: 'Mathematics' },
    afterValue: { name: 'Advanced Mathematics' },
    createdAt: '2024-05-15T11:15:00Z',
  },
];

// System Settings Mock Data
export const mockSystemSettings = {
  general: {
    platformName: 'Connecti',
    supportEmail: 'support@connecti.com',
    maintenanceMode: false,
  },
  booking: {
    holdDuration: 24,
    cancellationWindow: 4,
    allowTutorCancellation: true,
    allowStudentCancellation: true,
  },
  payment: {
    paymentGateway: 'Stripe',
    bankTransferInfo: 'Account details for bank transfers',
    expirationTime: 30,
  },
  commission: {
    platformCommissionPercentage: 20,
    tutorPayoutHoldDuration: 7,
    minimumPayoutAmount: 50,
  },
  notification: {
    emailNotifications: true,
    sessionReminderTime: 24,
    systemAnnouncement: true,
  },
  security: {
    adminSessionDuration: 480,
    passwordMinLength: 8,
    requireStrongPassword: true,
  },
};

// Helper functions to retrieve records by ID
export function getTutorById(id: string) {
  return mockTutors.find(t => t.id === id);
}

export function getUserById(id: string) {
  return mockUsers.find(u => u.id === id);
}

export function getBookingById(id: string) {
  return mockBookings.find(b => b.id === id);
}

export function getSessionById(id: string) {
  return mockSessions.find(s => s.id === id);
}

export function getPaymentById(id: string) {
  return mockPayments.find(p => p.id === id);
}

export function getRefundById(id: string) {
  return mockRefunds.find(r => r.id === id);
}

export function getPayoutById(id: string) {
  return mockPayouts.find(p => p.id === id);
}

export function getDisputeById(id: string) {
  return mockDisputes.find(d => d.id === id);
}

export function getConversationById(id: string) {
  return mockConversations.find(c => c.id === id);
}

export function getNotificationById(id: string) {
  return mockNotifications.find(n => n.id === id);
}

export function getSubjectById(id: string) {
  return mockSubjects.find(s => s.id === id);
}

export function getAdminById(id: string) {
  return mockAdmins.find(a => a.id === id);
}

export function getRoleById(id: string) {
  return mockRoles.find(r => r.id === id);
}

export function getAuditLogById(id: string) {
  return mockAuditLogs.find(a => a.id === id);
}
