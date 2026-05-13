'use client';

import { Users, Clock, AlertCircle, TrendingUp, DollarSign } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminStatCard } from '@/components/admin/admin-stat-card';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAdminUsersQuery } from '@/features/admin-users';
import { useAdminTutorsQuery, type AdminTutorListItem } from '@/features/admin-tutors';
import { useAdminBookingsQuery, type AdminBookingListItem } from '@/features/admin-bookings';
import { useAdminDisputesQuery, type AdminDisputeListItem } from '@/features/admin-disputes';
import { Skeleton } from '@/components/ui/skeleton';


export default function AdminDashboardPage() {
  const { data: usersData, isLoading: isLoadingUsers, isError: isErrorUsers } = useAdminUsersQuery({ limit: 1, page: 1 });
  const { data: tutorsData, isLoading: isLoadingTutors, isError: isErrorTutors } = useAdminTutorsQuery({ limit: 5, page: 1, status: 'pending' });
  const { data: bookingsData, isLoading: isLoadingBookings, isError: isErrorBookings } = useAdminBookingsQuery({ limit: 5, page: 1 });
  const { data: disputesData, isLoading: isLoadingDisputes, isError: isErrorDisputes } = useAdminDisputesQuery({ limit: 5, page: 1, status: 'open' });

  const stats = [
    {
      title: 'Total Users',
      value: usersData?.total ?? 0,
      icon: <Users className="h-6 w-6" />,
      isLoading: isLoadingUsers,
      isError: isErrorUsers,
    },
    {
      title: 'Pending Tutors',
      value: tutorsData?.total ?? 0,
      icon: <Clock className="h-6 w-6" />,
      isLoading: isLoadingTutors,
      isError: isErrorTutors,
    },
    {
      title: 'Recent Bookings',
      value: bookingsData?.total ?? 0,
      icon: <TrendingUp className="h-6 w-6" />,
      isLoading: isLoadingBookings,
      isError: isErrorBookings,
    },
    {
      title: 'Open Disputes',
      value: disputesData?.total ?? 0,
      icon: <AlertCircle className="h-6 w-6" />,
      isLoading: isLoadingDisputes,
      isError: isErrorDisputes,
    },
  ];

  const recentBookings = bookingsData?.items ?? [];
  const pendingTutors = tutorsData?.items ?? [];
  const openDisputes = disputesData?.items ?? [];

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="Welcome back! Here's an overview of your platform."
      />

      {/* Stat Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          stat.isLoading ? (
            <Card key={index} className="p-6 flex flex-row items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-1/3" />
              </div>
            </Card>
          ) : stat.isError ? (
            <Card key={index} className="p-6 flex flex-row items-center gap-4 border-destructive/50">
              <div className="h-12 w-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-lg font-bold text-destructive">Error</p>
              </div>
            </Card>
          ) : (
            <AdminStatCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
            />
          )
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Bookings */}
        <Card className="lg:col-span-2">
          <div className="border-b border-border px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Recent Bookings</h2>
          </div>
          <div className="overflow-x-auto">
            {isLoadingBookings ? (
              <div className="p-6 space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : isErrorBookings ? (
              <div className="p-6 text-center text-sm text-destructive">Failed to load bookings.</div>
            ) : recentBookings.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">No recent bookings.</div>
            ) : (
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
                  {recentBookings.map((booking: AdminBookingListItem) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-mono text-sm max-w-[120px] truncate" title={booking.id}>{booking.id}</TableCell>
                      <TableCell>{booking.subjectName}</TableCell>
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
            )}
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
              {isLoadingTutors ? (
                <div className="p-4 space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : isErrorTutors ? (
                <div className="p-4 text-center text-sm text-destructive">Failed to load pending tutors.</div>
              ) : pendingTutors.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">No pending approvals.</div>
              ) : (
                pendingTutors.map((tutor: AdminTutorListItem) => (
                  <div key={tutor.id} className="px-6 py-3">
                    <p className="text-sm font-medium text-foreground">{tutor.fullName}</p>
                    <p className="text-xs text-muted-foreground">{tutor.email}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {tutor.subjects ? tutor.subjects.map(s => s.name).join(', ') : 'No subjects'}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Open Disputes */}
          <Card>
            <div className="border-b border-border px-6 py-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">Open Disputes</h3>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </div>
            <div className="divide-y divide-border">
              {isLoadingDisputes ? (
                <div className="p-4 space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-2 flex justify-between">
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                  ))}
                </div>
              ) : isErrorDisputes ? (
                <div className="p-4 text-center text-sm text-destructive">Failed to load disputes.</div>
              ) : openDisputes.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">No open disputes.</div>
              ) : (
                openDisputes.map((dispute: AdminDisputeListItem) => (
                  <div key={dispute.id} className="px-6 py-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{dispute.subject}</p>
                        <p className="text-xs font-mono text-muted-foreground truncate max-w-[150px]">{dispute.id}</p>
                      </div>
                      <AdminStatusBadge status={dispute.priority} customLabel={dispute.priority?.charAt(0).toUpperCase() + dispute.priority?.slice(1)} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
