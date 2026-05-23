import { Payment } from '../types';

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
    currency: p?.currency || 'VND',
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

export function normalizePaymentDetailResponse(raw: any): Payment {
  const p = raw?.payment || raw;
  const normalized = normalizePayment(p);
  
  return {
    ...normalized,
    tutorName: raw?.tutorSummary?.tutorName || normalized.tutorName,
    subject: raw?.bookingSummary?.subjectName || normalized.subject,
    transferInstructions: raw?.paymentInstruction?.supportMessage || normalized.transferInstructions,
    transferReference: raw?.paymentInstruction?.transferNote || normalized.transferReference,
  };
}
