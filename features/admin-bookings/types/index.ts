export type AdminBookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type AdminPaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface AdminBookingStudent {
  id: string;
  name: string;
  email: string;
}

export interface AdminBookingTutor {
  id: string;
  name: string;
  email: string;
}

export interface AdminBookingListItem {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  tutorId: string;
  tutorName: string;
  tutorEmail: string;
  subjectName: string;
  startTime: string;
  endTime: string;
  status: AdminBookingStatus;
  paymentStatus: AdminPaymentStatus;
  amount: number;
  createdAt: string;
  updatedAt?: string | null;
}

export interface AdminBookingsQueryParams {
  keyword?: string;
  status?: AdminBookingStatus;
  page?: number;
  limit?: number;
}

export interface AdminBookingsListResponse {
  items: AdminBookingListItem[];
  total: number;
  page: number;
  limit: number;
  offset: number;
  totalPages: number;
}

export interface AdminBookingDetail extends AdminBookingListItem {
  student: AdminBookingStudent;
  tutor: AdminBookingTutor;
  description?: string | null;
  notes?: string | null;
}
