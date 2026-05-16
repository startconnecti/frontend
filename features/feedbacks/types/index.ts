export interface FeedbackPayload {
  session_id: string;
  rating: number; // 1-5
  comment: string;
}

export interface FeedbackResponse {
  success: boolean;
  data: {
    id: string;
    sessionId: string;
    rating: number;
    comment: string;
    createdAt: string;
  };
}
