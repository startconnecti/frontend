import { api } from '@/lib/api/client';
import { FeedbackPayload, FeedbackResponse } from '../types/index';

export const feedbackService = {
  async createFeedback(payload: FeedbackPayload): Promise<FeedbackResponse> {
    return api.post<FeedbackResponse>('/api/v1/feedbacks', payload);
  },

  async getStudentFeedbacks(params: { page?: number; limit?: number; studentId?: string }): Promise<{ items: any[]; meta: { pagination: { total: number; page: number; limit: number; totalPages: number; } } }> {
    return api.get('/api/v1/feedbacks', { params });
  },

  async updateFeedback(id: string, payload: Partial<FeedbackPayload>): Promise<FeedbackResponse> {
    return api.put<FeedbackResponse>(`/api/v1/feedbacks/${id}`, payload);
  },

  async deleteFeedback(id: string): Promise<void> {
    return api.delete<void>(`/api/v1/feedbacks/${id}`);
  }
};
