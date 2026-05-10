'use client';

import { 
  CreditCard, 
  Calendar, 
  User, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  RotateCcw,
  ExternalLink,
  FileText,
  ShieldAlert
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Payment } from '../types';

interface PaymentDetailCardProps {
  payment: Payment;
}

export function PaymentDetailCard({ payment }: PaymentDetailCardProps) {
  const statusColors = {
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    processing: 'bg-blue-100 text-blue-700 border-blue-200',
    succeeded: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    failed: 'bg-rose-100 text-rose-700 border-rose-200',
    cancelled: 'bg-slate-100 text-slate-700 border-slate-200',
    refunded: 'bg-purple-100 text-purple-700 border-purple-200',
  };

  const statusIcons = {
    pending: Clock,
    processing: RotateCcw,
    succeeded: CheckCircle2,
    failed: AlertCircle,
    cancelled: AlertCircle,
    refunded: RotateCcw,
  };

  const StatusIcon = statusIcons[payment.status];

  return (
    <Card className="border-border/60 shadow-xl shadow-primary/5 rounded-3xl overflow-hidden">
      <CardHeader className="bg-muted/10 border-b border-border/40 p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-2xl font-black" style={{ color: '#2C1208' }}>
                Payment {payment.paymentCode}
              </CardTitle>
              <StatusIcon className={`h-5 w-5 ${payment.status === 'succeeded' ? 'text-emerald-600' : 'text-amber-600'}`} />
            </div>
            <p className="text-xs text-muted-foreground font-medium">Transaction ID: {payment.id}</p>
          </div>
          <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${statusColors[payment.status]}`}>
            {payment.status}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-10 space-y-10">
        {/* Top Section: Amount & Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <CreditCard className="h-3 w-3" />
              Amount Detail
            </h4>
            <div className="space-y-3 p-6 rounded-2xl bg-primary/5 border border-primary/10">
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-muted-foreground">Total Paid</span>
                <span className="text-3xl font-black" style={{ color: '#2C1208' }}>${payment.amountTotal}</span>
              </div>
              <div className="pt-3 border-t border-primary/10 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Tutor Fee</span>
                  <span className="font-bold">${payment.amountTotal - payment.platformFee}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Platform Fee</span>
                  <span className="font-bold">${payment.platformFee}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <BookOpen className="h-3 w-3" />
                Service Context
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Tutor</p>
                    <p className="text-sm font-bold">{payment.tutor.fullName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BookOpen className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Subject</p>
                    <p className="text-sm font-bold">{payment.subject}</p>
                  </div>
                </div>
                {payment.sessionTime && (
                  <div className="flex items-start gap-3">
                    <Calendar className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Scheduled For</p>
                      <p className="text-sm font-bold">{new Date(payment.sessionTime).toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Clock className="h-3 w-3" />
                Timestamps
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Created On</p>
                    <p className="text-sm font-bold">{new Date(payment.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                {payment.paidAt && (
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Settled On</p>
                      <p className="text-sm font-bold">{new Date(payment.paidAt).toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Method Details */}
        <div className="p-6 rounded-2xl border border-border/40 bg-muted/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Payment Method</h4>
            <p className="text-sm font-bold capitalize">{payment.method.replace(/_/g, ' ')}</p>
          </div>
          {payment.transferReference && (
            <div className="space-y-1 md:text-right">
              <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Transfer Reference</h4>
              <p className="text-sm font-mono font-bold">{payment.transferReference}</p>
            </div>
          )}
          {payment.proofFileUrl && (
            <Button variant="outline" size="sm" className="gap-2 font-bold" asChild>
              <a href={payment.proofFileUrl} target="_blank" rel="noopener noreferrer">
                <FileText className="h-4 w-4" />
                View Proof
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          )}
        </div>

        {/* Refund Summary */}
        {payment.status === 'refunded' && payment.refundSummary && (
          <div className="p-6 rounded-2xl bg-purple-50 border border-purple-100 flex items-start gap-4">
            <RotateCcw className="h-6 w-6 text-purple-600 shrink-0" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-purple-900 uppercase tracking-widest">Refund Summary</p>
              <p className="text-lg font-black text-purple-900">-${payment.refundSummary.amount}</p>
              <p className="text-sm text-purple-800 italic">"{payment.refundSummary.reason}"</p>
              <p className="text-[10px] text-purple-600 font-medium">Refunded on {new Date(payment.refundSummary.refundedAt).toLocaleString()}</p>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="bg-muted/10 border-t border-border/40 p-6 flex flex-wrap gap-4">
        {payment.status === 'pending' && (
          <Button className="font-bold gap-2" disabled>
            Continue Payment
          </Button>
        )}
        
        {payment.status === 'succeeded' && (
          <Button variant="outline" className="font-bold gap-2" disabled>
            <RotateCcw className="h-4 w-4" />
            Request Refund
          </Button>
        )}

        <Button variant="ghost" className="font-bold text-muted-foreground hover:text-rose-600 gap-2 ml-auto" disabled>
          <ShieldAlert className="h-4 w-4" />
          Open Dispute
        </Button>
      </CardFooter>
    </Card>
  );
}
