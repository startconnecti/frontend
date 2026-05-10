import { api } from '@/lib/api/client';
import { Feedback, CreateFeedbackRequest, TutorReviewSummary } from '../types';

export const feedbackService = {
  async getStudentFeedbacks(): Promise<Feedback[]> {
    return api.get<Feedback[]>('/api/v1/feedbacks/me');
  },

  async getTutorReviews(): Promise<Feedback[]> {
    return api.get<Feedback[]>('/api/v1/feedbacks/tutor');
  },

  async getTutorReviewSummary(): Promise<TutorReviewSummary> {
    const reviews = await this.getTutorReviews();
    const total = reviews.length;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const distribution = reviews.reduce((acc, r) => {
      acc[r.rating] = (acc[r.rating] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return {
      averageRating: total > 0 ? Number((sum / total).toFixed(1)) : 0,
      totalReviews: total,
      distribution,
    };
  },

  async createFeedback(request: CreateFeedbackRequest): Promise<Feedback> {
    return api.post<Feedback>('/api/v1/feedbacks', request);
  }
};
