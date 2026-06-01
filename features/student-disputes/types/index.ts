export interface StudentDisputeCreateRequest {
  session_id: string;
  dispute_type: 'quality_issue' | 'tutor_absent' | 'ended_early' | 'payment_issue' | 'other';
  reason: string;
  requested_resolution?: 'full_refund' | 'partial_refund' | 'reschedule' | 'other';
  requested_refund_amount?: number;
}
