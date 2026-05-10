'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { PageContainer } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { useQueryClient } from '@tanstack/react-query';

function PaymentReturnContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  
  const paymentId = searchParams.get('paymentId') || searchParams.get('vnp_TxnRef') || searchParams.get('orderId');

  useEffect(() => {
    if (paymentId) {
      // Invalidate relevant queries to ensure the status is fresh when we redirect
      queryClient.invalidateQueries({ queryKey: ['payment-detail', paymentId] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['student-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });

      // Short delay to allow backend to process the webhook if any
      const timer = setTimeout(() => {
        router.push(ROUTES.STUDENT.PAYMENT_DETAIL(paymentId));
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [paymentId, router, queryClient]);

  if (!paymentId) {
    return (
      <PageContainer className="py-20 flex flex-col items-center justify-center text-center space-y-6">
        <div className="h-20 w-20 bg-rose-100 rounded-full flex items-center justify-center text-rose-600">
          <AlertCircle className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">Invalid Payment Return</h3>
          <p className="text-muted-foreground">We couldn't identify the payment transaction from the return URL.</p>
        </div>
        <Button onClick={() => router.push(ROUTES.STUDENT.PAYMENTS)}>Go to Billing</Button>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="py-20 flex flex-col items-center justify-center text-center space-y-8">
      <div className="relative">
        <div className="h-24 w-24 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <CheckCircle2 className="h-10 w-10 text-primary/40" />
        </div>
      </div>
      
      <div className="space-y-3 max-w-md">
        <h2 className="text-3xl font-black text-brand-dark">Processing Payment</h2>
        <p className="text-muted-foreground">
          Please wait while we verify your transaction status with the payment provider.
          You will be redirected automatically.
        </p>
      </div>

      <div className="flex items-center gap-2 text-sm font-bold text-primary animate-pulse">
        <Loader2 className="h-4 w-4 animate-spin" />
        Verifying status...
      </div>
    </PageContainer>
  );
}

export default function PaymentReturnPage() {
  return (
    <Suspense fallback={
      <PageContainer className="py-20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </PageContainer>
    }>
      <PaymentReturnContent />
    </Suspense>
  );
}
