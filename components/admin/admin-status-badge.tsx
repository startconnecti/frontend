import { Badge } from '@/components/ui/badge';

type StatusVariant = 'default' | 'secondary' | 'destructive' | 'outline';

const statusStyles: Record<string, { variant: StatusVariant; label: string }> = {
  // User/Tutor statuses
  active: { variant: 'default', label: 'Active' },
  blocked: { variant: 'destructive', label: 'Blocked' },
  suspended: { variant: 'destructive', label: 'Suspended' },

  // Tutor approval statuses
  pending: { variant: 'secondary', label: 'Pending' },
  approved: { variant: 'default', label: 'Approved' },
  rejected: { variant: 'destructive', label: 'Rejected' },

  // Booking statuses
  confirmed: { variant: 'default', label: 'Confirmed' },
  completed: { variant: 'default', label: 'Completed' },
  cancelled: { variant: 'destructive', label: 'Cancelled' },
  payment_processing: { variant: 'secondary', label: 'Processing' },
  wait_for_admin_review: { variant: 'secondary', label: 'Review' },
  expired: { variant: 'secondary', label: 'Expired' },
  pending_payment: { variant: 'secondary', label: 'Pending Payment' },

  // Payment statuses
  processing: { variant: 'secondary', label: 'Processing' },
  succeeded: { variant: 'default', label: 'Succeeded' },
  failed: { variant: 'destructive', label: 'Failed' },
  refunded: { variant: 'secondary', label: 'Refunded' },

  // Session statuses
  'in-progress': { variant: 'secondary', label: 'In Progress' },

  // Refund statuses
  'refund-pending': { variant: 'secondary', label: 'Pending' },
  'refund-approved': { variant: 'default', label: 'Approved' },
  'refund-rejected': { variant: 'destructive', label: 'Rejected' },
  processed: { variant: 'default', label: 'Processed' },

  // Dispute statuses
  open: { variant: 'destructive', label: 'Open' },
  'under_review': { variant: 'secondary', label: 'Under Review' },
  resolved: { variant: 'default', label: 'Resolved' },

  // Dispute priorities
  low: { variant: 'secondary', label: 'Low' },
  medium: { variant: 'secondary', label: 'Medium' },
  high: { variant: 'destructive', label: 'High' },

  // Subject statuses
  inactive: { variant: 'secondary', label: 'Inactive' },
};

interface AdminStatusBadgeProps {
  status: string;
  customLabel?: string;
  type?: 'payout' | 'payment' | 'user' | 'booking' | 'refund' | 'session' | 'dispute';
}

export function AdminStatusBadge({ status, customLabel, type }: AdminStatusBadgeProps) {
  if (type === 'session') {
    const sessionStatuses: Record<string, { className: string; label: string }> = {
      scheduled: { className: 'bg-blue-100 text-blue-800 hover:bg-blue-100/80 border-transparent', label: 'Scheduled' },
      completed: { className: 'bg-green-100 text-green-800 hover:bg-green-100/80 border-transparent', label: 'Completed' },
      cancelled: { className: 'bg-red-100 text-red-800 hover:bg-red-100/80 border-transparent', label: 'Cancelled' },
      expired: { className: 'bg-gray-200 text-gray-800 hover:bg-gray-200/80 border-transparent', label: 'Expired' },
      pending: { className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80 border-transparent', label: 'Pending' },
      no_show: { className: 'bg-orange-100 text-orange-800 hover:bg-orange-100/80 border-transparent', label: 'No Show' },
    };
    const config = sessionStatuses[status] || { className: 'bg-gray-100 text-gray-800 border-transparent', label: status };
    return (
      <Badge className={config.className}>
        {customLabel || config.label}
      </Badge>
    );
  }

  if (type === 'refund') {
    const refundStatuses: Record<string, { className: string; label: string }> = {
      pending: { className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80 border-transparent', label: 'Pending' },
      approved: { className: 'bg-blue-100 text-blue-800 hover:bg-blue-100/80 border-transparent', label: 'Approved' },
      processing: { className: 'bg-purple-100 text-purple-800 hover:bg-purple-100/80 border-transparent', label: 'Processing' },
      refunded: { className: 'bg-green-100 text-green-800 hover:bg-green-100/80 border-transparent', label: 'Refunded' },
      rejected: { className: 'bg-red-100 text-red-800 hover:bg-red-100/80 border-transparent', label: 'Rejected' },
      failed: { className: 'bg-gray-200 text-gray-800 hover:bg-gray-200/80 border-transparent', label: 'Failed' },
      cancelled: { className: 'bg-gray-200 text-gray-800 hover:bg-gray-200/80 border-transparent', label: 'Cancelled' },
    };
    const config = refundStatuses[status] || { className: 'bg-gray-100 text-gray-800 border-transparent', label: status };
    return (
      <Badge className={config.className}>
        {customLabel || config.label}
      </Badge>
    );
  }

  if (type === 'dispute') {
    const disputeStatuses: Record<string, { className: string; label: string }> = {
      open: { className: 'bg-red-100 text-red-800 hover:bg-red-100/80 border-transparent', label: 'Open' },
      pending: { className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80 border-transparent', label: 'Pending' },
      reviewing: { className: 'bg-blue-100 text-blue-800 hover:bg-blue-100/80 border-transparent', label: 'Reviewing' },
      resolved: { className: 'bg-green-100 text-green-800 hover:bg-green-100/80 border-transparent', label: 'Resolved' },
      rejected: { className: 'bg-red-100 text-red-800 hover:bg-red-100/80 border-transparent', label: 'Rejected' },
      closed: { className: 'bg-gray-200 text-gray-700 hover:bg-gray-200/80 border-transparent', label: 'Closed' },
    };
    const config = disputeStatuses[status] || { className: 'bg-gray-100 text-gray-800 border-transparent', label: status };
    return (
      <Badge className={config.className}>
        {customLabel || config.label}
      </Badge>
    );
  }

  // Map payout status specifically
  if (type === 'payout') {
    const payoutStatuses: Record<string, { variant: StatusVariant; label: string }> = {
      pending: { variant: 'secondary', label: 'Pending' },
      processing: { variant: 'secondary', label: 'Processing' },
      paid: { variant: 'default', label: 'Paid' },
      failed: { variant: 'destructive', label: 'Failed' },
      cancelled: { variant: 'destructive', label: 'Cancelled' },
    };
    const config = payoutStatuses[status] || { variant: 'outline', label: status };
    return (
      <Badge variant={config.variant}>
        {customLabel || config.label}
      </Badge>
    );
  }

  const config = statusStyles[status] || { variant: 'outline', label: status };
  
  return (
    <Badge variant={config.variant}>
      {customLabel || config.label}
    </Badge>
  );
}
