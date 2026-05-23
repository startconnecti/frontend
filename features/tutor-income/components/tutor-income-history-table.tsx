'use client';

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TutorIncomeTransaction } from '../types/index';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface TutorIncomeHistoryTableProps {
  transactions: TutorIncomeTransaction[];
  isLoading: boolean;
}

export function TutorIncomeHistoryTable({ transactions, isLoading }: TutorIncomeHistoryTableProps) {
  const formatCurrency = (amount: number) => `${amount.toLocaleString('vi-VN')} đ`;

  const getStatusConfig = (status: TutorIncomeTransaction['status']) => {
    switch (status) {
      case 'available':
        return { label: 'Available', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
      case 'pending':
        return { label: 'Pending', className: 'bg-amber-100 text-amber-700 border-amber-200' };
      case 'refunded':
        return { label: 'Refunded', className: 'bg-rose-100 text-rose-700 border-rose-200' };
      default:
        return { label: status, className: 'bg-muted text-muted-foreground border-border' };
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!transactions.length) {
    return (
      <Card className="border-border/60 bg-muted/10 border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <span className="text-2xl text-muted-foreground">💸</span>
          </div>
          <p className="text-sm font-bold text-brand-dark mb-1">No income records found</p>
          <p className="text-xs text-muted-foreground max-w-sm text-center">
            You don't have any income transactions for this period. Completed sessions will appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:block rounded-xl border border-border/60 overflow-hidden bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-bold">Reference</TableHead>
              <TableHead className="font-bold">Session & Student</TableHead>
              <TableHead className="font-bold">Date</TableHead>
              <TableHead className="font-bold text-right">Net Earnings</TableHead>
              <TableHead className="font-bold text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => {
              const statusConfig = getStatusConfig(tx.status);
              
              return (
                <TableRow key={tx.earningId} className="group">
                  <TableCell>
                    <div className="font-medium text-xs text-brand-dark">
                      #{tx.paymentId.slice(-6).toUpperCase()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-bold text-brand-dark truncate max-w-[200px]">
                        {tx.subjectName}
                      </span>
                      <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                        with {tx.studentName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium">
                        {format(new Date(tx.sessionStartTime), 'MMM d, yyyy')}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(tx.sessionStartTime), 'HH:mm')} - {format(new Date(tx.sessionEndTime), 'HH:mm')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end space-y-1">
                      <span className="text-sm font-black text-primary">
                        {formatCurrency(tx.netAmount)}
                      </span>
                      <span className="text-[10px] text-muted-foreground/80 font-medium line-through">
                        {formatCurrency(tx.grossAmount)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={cn(
                      'inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border',
                      statusConfig.className
                    )}>
                      {statusConfig.label}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {transactions.map((tx) => {
          const statusConfig = getStatusConfig(tx.status);
          
          return (
            <Card key={tx.earningId} className="border-border/60 overflow-hidden shadow-sm">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className={cn(
                      'inline-flex px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border',
                      statusConfig.className
                    )}>
                      {statusConfig.label}
                    </span>
                    <div className="text-[10px] font-bold text-muted-foreground mt-1">
                      REF: #{tx.paymentId.slice(-6).toUpperCase()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-primary">
                      {formatCurrency(tx.netAmount)}
                    </div>
                    <div className="text-[10px] text-muted-foreground/80 font-medium line-through">
                      {formatCurrency(tx.grossAmount)}
                    </div>
                  </div>
                </div>
                
                <div className="pt-3 border-t border-border/40 grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Session</p>
                    <p className="text-xs font-bold text-brand-dark truncate">{tx.subjectName}</p>
                    <p className="text-[10px] text-muted-foreground truncate">with {tx.studentName}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date</p>
                    <p className="text-xs font-bold text-brand-dark">
                      {format(new Date(tx.sessionStartTime), 'MMM d, yyyy')}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {format(new Date(tx.sessionStartTime), 'HH:mm')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
