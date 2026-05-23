'use client';

import { useState } from 'react';
import { TutorIncomeSummaryCards } from './tutor-income-summary-cards';
import { TutorIncomeHistoryTable } from './tutor-income-history-table';
import { useTutorIncomeTransactionsQuery } from '../hooks/use-tutor-income-transactions-query';
import { GetTutorIncomeFilters, TutorIncomeStatus } from '../types/index';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function TutorIncomePage() {
  const [filters, setFilters] = useState<GetTutorIncomeFilters>({
    page: 1,
    limit: 10,
    status: 'all',
  });

  const { data, isLoading } = useTutorIncomeTransactionsQuery(filters);

  const handleStatusChange = (val: string) => {
    setFilters((prev) => ({
      ...prev,
      status: val as TutorIncomeStatus | 'all',
      page: 1, // reset page on filter change
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const transactions = data?.items || [];
  const pagination = data?.pagination;
  const hasNextPage = pagination && pagination.page * pagination.limit < pagination.total;
  const hasPrevPage = pagination && pagination.page > 1;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-black text-brand-dark tracking-tight mb-2">Income & Earnings</h1>
        <p className="text-muted-foreground font-medium">
          Track your lifetime earnings, pending payouts, and recent session incomes.
        </p>
      </div>

      <section>
        <TutorIncomeSummaryCards />
      </section>

      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-bold text-brand-dark tracking-tight">Earnings History</h2>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 w-full sm:w-auto bg-card border rounded-lg px-3 py-1.5 shadow-sm">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select 
                value={filters.status} 
                onValueChange={handleStatusChange}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full sm:w-[150px] border-0 bg-transparent h-7 px-1 focus:ring-0">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <TutorIncomeHistoryTable 
          transactions={transactions} 
          isLoading={isLoading} 
        />

        {/* Pagination */}
        {pagination && pagination.total > 0 && (
          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-muted-foreground font-medium">
              Showing <span className="font-bold text-brand-dark">{transactions.length}</span> of <span className="font-bold text-brand-dark">{pagination.total}</span> records
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(filters.page! - 1)}
                disabled={!hasPrevPage || isLoading}
                className="font-bold h-8 px-3"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(filters.page! + 1)}
                disabled={!hasNextPage || isLoading}
                className="font-bold h-8 px-3"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
