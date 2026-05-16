export interface Feedback {
  feedbackId: string;
  sessionId: string;
  studentId: string;
  tutorId: string;
  tutorName: string;
  studentName: string;
  subject: string;
  rating: number; // 1-5
  comment?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateFeedbackRequest {
  sessionId: string;
  rating: number;
  comment?: string;
}

export interface TutorReviewSummary {
  averageRating: number;
  totalReviews: number;
  distribution: Record<number, number>; // rating -> count
}
