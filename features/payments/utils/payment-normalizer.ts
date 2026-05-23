import { Payment } from '../types';
import { PLATFORM_CURRENCY } from '@/lib/constants/currency';

export function formatPaymentMethod(method?: string | null): string {
  if (!method) return 'Unknown';
  if (method === 'manual_bank_transfer' || method === 'bank_transfer') return 'Manual Bank Transfer';
  if (method === 'vnpay') return 'VNPay';
  if (method === 'momo') return 'MoMo';
  return method.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function normalizePayment(raw: any): Payment {
  const p = raw?.payment || raw; // Handle both wrapped and unwrapped

  return {
    id: p?.id || p?.paymentId || 'Unknown',
    paymentCode: p?.paymentCode || p?.transferNote || 'N/A',
    bookingId: p?.bookingId || '',
    tutorProfileId: p?.tutorProfileId || p?.booking?.tutorId,
    tutorName: raw?.tutorName || p?.tutorName || p?.tutor?.fullName || p?.booking?.tutor?.user?.fullName || 'Unknown Tutor',
    subject: raw?.subject || p?.subject || 'Standard Session',
    amount: p?.amount ?? p?.amountTotal ?? p?.totalAmount ?? 0,
    amountTotal: p?.amountTotal ?? p?.totalAmount ?? p?.amount ?? 0,
    platformFee: p?.platformFee || 0,
    currency: PLATFORM_CURRENCY,
    method: formatPaymentMethod(p?.method || p?.paymentMethod),
    status: p?.status || 'pending',
    createdAt: p?.createdAt || new Date().toISOString(),
    paidAt: p?.confirmedAt || p?.paidAt || null,

    transferInstructions: p?.transferInstructions || null,
    transferReference: p?.transferReference || p?.paymentCode || null,
    paymentUrl: p?.paymentUrl || p?.checkoutUrl || null,
    proofFileUrl: p?.proofFileUrl || null,
    refundSummary: p?.refundSummary || null,
  };
}

export function normalizePaymentDetailResponse(raw: any): any {
  // It returns PaymentDetail now but we keep type simple to avoid circular imports here if not needed
  const payment = normalizePayment(raw?.payment || raw);
  
  return {
    payment,
    bookingSummary: raw?.bookingSummary || null,
    tutorSummary: raw?.tutorSummary || null,
    session: raw?.session ? {
      id: raw.session.id,
      status: raw.session.status,
      meetingStatus: raw.session.meetingStatus || null,
      meetingUrl: raw.session.meetingUrl || null,
      scheduledStartTime: raw.session.scheduledStartTime || raw.session.startTime || null,
      scheduledEndTime: raw.session.scheduledEndTime || raw.session.endTime || null,
    } : null,
    paymentInstruction: raw?.paymentInstruction || null,
  };
}
