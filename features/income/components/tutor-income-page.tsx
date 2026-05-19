'use client';

import { DollarSign, Clock, Wallet, Calendar, ArrowUpRight, TrendingUp } from 'lucide-react';
import { PageContainer, SectionHeader } from '@/components/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

// Mock Transaction Data
const mockTransactions = [
  {
    id: 'TX-1001',
    date: '2026-05-18',
    studentName: 'Emma Watson',
    subject: 'Organic Chemistry II',
    amount: 120.00,
    status: 'cleared',
  },
  {
    id: 'TX-1002',
    date: '2026-05-17',
    studentName: 'John Doe',
    subject: 'Introduction to Calculus',
    amount: 80.00,
    status: 'cleared',
  },
  {
    id: 'TX-1003',
    date: '2026-05-19',
    studentName: 'Alice Smith',
    subject: 'Physics: Electromagnetism',
    amount: 150.00,
    status: 'pending',
  },
  {
    id: 'TX-1004',
    date: '2026-05-15',
    studentName: 'Emma Watson',
    subject: 'Organic Chemistry II',
    amount: 120.00,
    status: 'cleared',
  },
  {
    id: 'TX-1005',
    date: '2026-05-14',
    studentName: 'Michael Brown',
    subject: 'Spanish Conversation',
    amount: 50.00,
    status: 'failed',
  },
];

export function TutorIncomePage() {
  return (
    <PageContainer className="py-8 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <SectionHeader 
          title="Income & Earnings"
          description="Track your earnings, pending balances, and available payout funds."
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Earnings */}
        <Card className="relative overflow-hidden border-border/60 shadow-lg bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group rounded-3xl">
          <div className="absolute top-0 right-0 h-32 w-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:scale-150 transition-all duration-500" />
          <CardContent className="p-8 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Earnings</span>
              <div className="h-10 w-10 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-4xl font-black text-brand-dark tracking-tight">$520.00</h3>
              <p className="text-xs text-muted-foreground font-medium">Lifetime cumulative earnings</p>
            </div>
          </CardContent>
        </Card>

        {/* Pending Clearance */}
        <Card className="relative overflow-hidden border-border/60 shadow-lg bg-gradient-to-br from-amber-500/10 via-transparent to-transparent hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group rounded-3xl">
          <div className="absolute top-0 right-0 h-32 w-32 bg-amber-500/5 rounded-full blur-2xl group-hover:scale-150 transition-all duration-500" />
          <CardContent className="p-8 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Pending Clearance</span>
              <div className="h-10 w-10 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-4xl font-black text-brand-dark tracking-tight">$150.00</h3>
              <p className="text-xs text-muted-foreground font-medium">Funds locked in pending clearance</p>
            </div>
          </CardContent>
        </Card>

        {/* Available for Payout */}
        <Card className="relative overflow-hidden border-border/60 shadow-lg bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group rounded-3xl">
          <div className="absolute top-0 right-0 h-32 w-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:scale-150 transition-all duration-500" />
          <CardContent className="p-8 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Available for Payout</span>
              <div className="h-10 w-10 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                <Wallet className="h-5 w-5" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-4xl font-black text-brand-dark tracking-tight">$370.00</h3>
              <p className="text-xs text-muted-foreground font-medium">Ready to be requested for payout</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-black tracking-tight text-brand-dark">Recent Transactions</h3>
        
        <Card className="border-border/60 shadow-md overflow-hidden rounded-3xl">
          <Table>
            <TableHeader className="bg-muted/10">
              <TableRow>
                <TableHead className="font-bold text-xs uppercase tracking-wider py-4 pl-6">Date</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider py-4">Student & Session Details</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider py-4">Amount</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider py-4 pr-6 text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTransactions.map((tx) => (
                <TableRow key={tx.id} className="hover:bg-muted/5 transition-colors">
                  <TableCell className="font-medium text-sm py-4 pl-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(tx.date).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-brand-dark">{tx.studentName}</p>
                      <p className="text-xs text-muted-foreground font-medium">{tx.subject}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-black text-sm text-brand-dark py-4">
                    ${tx.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="py-4 pr-6 text-right">
                    <Badge 
                      variant="outline" 
                      className={`font-black tracking-wider text-[10px] uppercase px-3 py-1 rounded-full ${
                        tx.status === 'cleared' 
                          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                          : tx.status === 'pending'
                          ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                      }`}
                    >
                      {tx.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </PageContainer>
  );
}
