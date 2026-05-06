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
}

export function AdminStatusBadge({ status, customLabel }: AdminStatusBadgeProps) {
  const config = statusStyles[status] || { variant: 'outline', label: status };
  
  return (
    <Badge variant={config.variant}>
      {customLabel || config.label}
    </Badge>
  );
}
