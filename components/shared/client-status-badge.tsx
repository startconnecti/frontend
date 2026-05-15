import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type StatusCategory = 
  | 'user' 
  | 'tutor_approval' 
  | 'booking' 
  | 'session' 
  | 'payment' 
  | 'dispute' 
  | 'refund' 
  | 'payout';

export type AllStatuses = 
  | 'active' | 'inactive' | 'blocked'
  | 'pending' | 'approved' | 'rejected' | 'suspended'
  | 'pending_payment' | 'payment_processing' | 'confirmed' | 'expired' | 'cancelled' | 'completed'
  | 'scheduled' | 'no_show'
  | 'waiting_admin_confirmation' | 'processing' | 'succeeded' | 'failed' | 'refunded'
  | 'open' | 'reviewing' | 'resolved'
  | 'processed' | 'paid';

interface StatusConfig {
  label: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
}

const statusMap: Record<AllStatuses, StatusConfig> = {
  // User
  active: { label: 'Active', variant: 'success' },
  inactive: { label: 'Inactive', variant: 'secondary' },
  blocked: { label: 'Blocked', variant: 'destructive' },

  // Tutor Approval / Payouts / Refunds
  pending: { label: 'Pending', variant: 'warning' },
  approved: { label: 'Approved', variant: 'success' },
  rejected: { label: 'Rejected', variant: 'destructive' },
  suspended: { label: 'Suspended', variant: 'destructive' },

  // Booking
  pending_payment: { label: 'Pending Payment', variant: 'warning' },
  payment_processing: { label: 'Processing Payment', variant: 'secondary' },
  confirmed: { label: 'Confirmed', variant: 'success' },
  expired: { label: 'Expired', variant: 'outline' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
  completed: { label: 'Completed', variant: 'default' },

  // Session
  scheduled: { label: 'Scheduled', variant: 'success' },
  no_show: { label: 'No Show', variant: 'destructive' },

  // Payment
  waiting_admin_confirmation: { label: 'Waiting Confirmation', variant: 'warning' },
  processing: { label: 'Processing', variant: 'secondary' },
  succeeded: { label: 'Succeeded', variant: 'success' },
  failed: { label: 'Failed', variant: 'destructive' },
  refunded: { label: 'Refunded', variant: 'secondary' },

  // Dispute
  open: { label: 'Open', variant: 'destructive' },
  reviewing: { label: 'Reviewing', variant: 'warning' },
  resolved: { label: 'Resolved', variant: 'success' },

  // Refund / Payout Specific
  processed: { label: 'Processed', variant: 'success' },
  paid: { label: 'Paid', variant: 'success' },
};

// Map success/warning to existing shadcn variants if they don't exist
// Note: Shadcn Badge by default has default, secondary, destructive, outline.
// We will use className to add custom success/warning styles if needed.

interface ClientStatusBadgeProps {
  status: AllStatuses;
  type?: string;
  className?: string;
}

export function ClientStatusBadge({ status, type, className }: ClientStatusBadgeProps) {
  const config = statusMap[status] || { label: status, variant: 'outline' };
  
  let badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline' = 'outline';
  let customClass = '';

  if (config.variant === 'success') {
    customClass = 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50/80';
  } else if (config.variant === 'warning') {
    customClass = 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50/80';
  } else {
    badgeVariant = config.variant as 'default' | 'secondary' | 'destructive' | 'outline';
  }

  return (
    <Badge variant={badgeVariant} className={cn(customClass, className)}>
      {config.label}
    </Badge>
  );
}
