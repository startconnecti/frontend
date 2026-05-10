import { Feedback, CreateFeedbackRequest, TutorReviewSummary } from '../types';
import { MOCK_FEEDBACKS } from '../mock-data';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let feedbackStorage = [...MOCK_FEEDBACKS];

export const feedbackService = {
  async getStudentFeedbacks(): Promise<Feedback[]> {
    const latency = Math.floor(Math.random() * (600 - 300 + 1)) + 300;
    await sleep(latency);
    return [...feedbackStorage];
  },

  async getTutorReviews(): Promise<Feedback[]> {
    const latency = Math.floor(Math.random() * (600 - 300 + 1)) + 300;
    await sleep(latency);
    // For this mock, assume tutor is tutor-001
    return feedbackStorage.filter(f => f.tutorId === 'tutor-001');
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
    const latency = Math.floor(Math.random() * (600 - 300 + 1)) + 300;
    await sleep(latency);
    
    const newFeedback: Feedback = {
      id: `fb-${Date.now()}`,
      sessionId: request.sessionId,
      studentId: 'student-001',
      tutorId: 'tutor-001', // Mock assumption
      tutorName: 'Dr. Sarah Wilson',
      studentName: 'Alex Johnson',
      subject: 'Physics',
      rating: request.rating,
      comment: request.comment,
      createdAt: new Date().toISOString(),
    };
    
    feedbackStorage.push(newFeedback);
    return newFeedback;
  }
};
