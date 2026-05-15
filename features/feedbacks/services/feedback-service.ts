import { api } from '@/lib/api/client';
import { Feedback, CreateFeedbackRequest, TutorReviewSummary } from '../types';
import { ListResponse } from '@/lib/api/types';

export const feedbackService = {
  async getStudentFeedbacks(): Promise<ListResponse<Feedback>> {
    const response = await api.get<any>('/api/v1/feedbacks/me');
    if (Array.isArray(response)) {
      return { items: response, total: response.length, limit: response.length, offset: 0 };
    }
    return {
      items: response?.items ?? response?.data ?? [],
      total: response?.total ?? 0,
      limit: response?.limit ?? 10,
      offset: response?.offset ?? 0
    };
  },

  async getTutorReviews(params?: any): Promise<ListResponse<Feedback>> {
    const response = await api.get<any>('/api/v1/feedbacks', { params });
    if (Array.isArray(response)) {
      return { items: response, total: response.length, limit: response.length, offset: 0 };
    }
    return {
      items: response?.items ?? response?.data ?? [],
      total: response?.total ?? 0,
      limit: response?.limit ?? 10,
      offset: response?.offset ?? 0
    };
  },

  async getTutorReviewSummary(): Promise<TutorReviewSummary> {
    const response = await this.getTutorReviews();
    const reviews = response.items;
    const total = response.total;
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
