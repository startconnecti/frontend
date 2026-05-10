'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Search } from 'lucide-react';

import { PageContainer, SectionHeader } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/constants/routes';
import { usePaymentDetailQuery } from '../hooks/use-payment-detail-query';
import { PaymentDetailCard } from './payment-detail-card';

export function PaymentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: payment, isLoading, isError } = usePaymentDetailQuery(id);

  if (isLoading) {
    return (
      <PageContainer className="py-8 space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-[500px] w-full rounded-xl" />
      </PageContainer>
    );
  }

  if (isError || !payment) {
    return (
      <PageContainer className="py-20 flex flex-col items-center justify-center text-center space-y-6">
        <div className="h-20 w-20 bg-rose-100 rounded-full flex items-center justify-center text-rose-600">
          <Search className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">Transaction not found</h3>
          <p className="text-muted-foreground">The payment record you are looking for does not exist or has been removed.</p>
        </div>
        <Button onClick={() => router.push(ROUTES.STUDENT.PAYMENTS)}>Back to Billing</Button>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="py-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push(ROUTES.STUDENT.PAYMENTS)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <SectionHeader 
          title="Transaction Details"
          description="View complete breakdown of this payment record."
        />
      </div>

      <PaymentDetailCard payment={payment} />
    </PageContainer>
  );
}
