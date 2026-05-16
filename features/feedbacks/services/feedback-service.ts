import { api } from '@/lib/api/client';
import { FeedbackPayload, FeedbackResponse } from '../types/index';

export const feedbackService = {
  async createFeedback(payload: FeedbackPayload): Promise<FeedbackResponse> {
    return api.post<FeedbackResponse>('/api/v1/feedbacks', payload);
  }
};
