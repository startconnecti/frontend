'use client';

import { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Pagination } from '@/components/shared/pagination';
import { Search, CreditCard } from 'lucide-react';

import { PageContainer, SectionHeader, ListState } from '@/components/shared';
import { PaymentCard } from '@/components/client/payment-card';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import Link from 'next/link';
import { useStudentPaymentsQuery } from '../hooks/use-student-payments-query';
import { PaymentFilters, PaymentStatus } from '../types';
import { PaymentFilterTabs } from './payment-filter-tabs';

export function StudentPaymentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const status = searchParams.get('status') || 'all';
  const page = searchParams.get('page') || '1';

  const { data, isLoading, isError, error, refetch } = useStudentPaymentsQuery({
    status: status as any,
    limit: 10,
    page: Number(page),
  });

  const payments = data?.items || [];
  const total = data?.meta?.pagination?.total || 0;

  const handleStatusChange = (newStatus: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('status', newStatus);
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <PageContainer className="py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <SectionHeader 
          title="Billing & Transactions"
          description="Manage your payments, invoices, and refund history."
        />
        <Button className="font-bold gap-2" asChild>
          <Link href={ROUTES.DISCOVER}>
            <Search className="h-4 w-4" />
            Find More Tutors
          </Link>
        </Button>
      </div>

      <PaymentFilterTabs 
        activeStatus={status as any} 
        onStatusChange={handleStatusChange} 
      />

      <ListState
        isLoading={isLoading}
        error={error as Error}
        isEmpty={payments.length === 0}
        emptyTitle="No payments found"
        emptyDescription="You don't have any transactions matching the selected filter."
        onRetry={() => refetch()}
      >
        <div className="grid grid-cols-1 gap-4">
          {payments.map((payment) => (
            <div key={payment.paymentId} className="cursor-pointer" onClick={() => router.push(ROUTES.STUDENT.PAYMENT_DETAIL(payment.paymentId))}>
              <PaymentCard
                id={payment.paymentId}
                amount={payment.amount}
                currency={payment.currency}
                status={payment.status}
                date={new Date(payment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                description={`Session with ${payment.tutorName ?? 'Unknown Tutor'}`}
                method={payment.method.replace(/_/g, ' ')}
              />
            </div>
          ))}
        </div>
        
        <Pagination 
          currentPage={Number(page)} 
          totalPages={Math.ceil(total / 10)} 
          onPageChange={handlePageChange} 
        />
      </ListState>
    </PageContainer>
  );
}
