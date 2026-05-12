'use client';

import { Users, Clock, AlertCircle, DollarSign, TrendingUp, MessageSquare } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminStatCard } from '@/components/admin/admin-stat-card';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockBookings, mockDisputes, mockTutors, mockUsers } from '@/lib/admin/mock-data';

export default function AdminDashboardPage() {
  const stats = [
    {
      title: 'Total Users',
      value: mockUsers.length,
      icon: <Users className="h-6 w-6" />,
      trend: { value: 12, isPositive: true },
    },
    {
      title: 'Pending Tutors',
      value: mockTutors.filter(t => t.approvalStatus === 'pending').length,
      icon: <Clock className="h-6 w-6" />,
      trend: { value: 5, isPositive: false },
    },
    {
      title: 'Active Bookings',
      value: mockBookings.filter(b => b.status === 'confirmed').length,
      icon: <TrendingUp className="h-6 w-6" />,
      trend: { value: 8, isPositive: true },
    },
    {
      title: 'Open Disputes',
      value: mockDisputes.filter(d => d.status === 'open').length,
      icon: <AlertCircle className="h-6 w-6" />,
      trend: { value: 2, isPositive: false },
    },
  ];

  const recentBookings = mockBookings.slice(0, 5);
  const pendingTutors = mockTutors.filter(t => t.approvalStatus === 'pending').slice(0, 3);
  const openDisputes = mockDisputes.filter(d => d.status === 'open').slice(0, 3);

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="Welcome back! Here&apos;s an overview of your platform. (Demo data for visualization purposes)"
      />

      {/* Stat Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <AdminStatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
          />
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Bookings */}
        <Card className="lg:col-span-2">
          <div className="border-b border-border px-6 py-4">
            <h2 className="text-lg font-bold text-foreground">Recent Bookings</h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBookings.map(booking => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-mono text-sm">{booking.id}</TableCell>
                    <TableCell>{booking.subject}</TableCell>
                    <TableCell>
                      <AdminStatusBadge status={booking.status} />
                    </TableCell>
                    <TableCell>${booking.amount}</TableCell>
                    <TableCell>
                      <AdminStatusBadge status={booking.paymentStatus} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Alerts */}
        <div className="space-y-4">
          {/* Pending Tutors */}
          <Card>
            <div className="border-b border-border px-6 py-4">
              <h3 className="text-sm font-bold text-foreground">Pending Approvals</h3>
            </div>
            <div className="divide-y divide-border">
              {pendingTutors.map(tutor => (
                <div key={tutor.id} className="px-6 py-3">
                  <p className="text-sm font-medium text-foreground">{tutor.name}</p>
                  <p className="text-xs text-muted-foreground">{tutor.email}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{tutor.subjects.join(', ')}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Open Disputes */}
          <Card>
            <div className="border-b border-border px-6 py-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">Open Disputes</h3>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </div>
            <div className="divide-y divide-border">
              {openDisputes.map(dispute => (
                <div key={dispute.id} className="px-6 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{dispute.subject}</p>
                      <p className="text-xs text-muted-foreground">{dispute.id}</p>
                    </div>
                    <AdminStatusBadge status={dispute.priority} customLabel={dispute.priority.charAt(0).toUpperCase() + dispute.priority.slice(1)} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
