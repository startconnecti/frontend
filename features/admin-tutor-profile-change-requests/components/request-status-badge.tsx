import { Badge } from '@/components/ui/badge';
import { AdminTutorProfileChangeRequestStatus } from '../types';

interface RequestStatusBadgeProps {
  status: AdminTutorProfileChangeRequestStatus;
}

export function RequestStatusBadge({ status }: RequestStatusBadgeProps) {
  switch (status) {
    case 'pending':
      return <Badge variant="warning">Pending</Badge>;
    case 'approved':
      return <Badge variant="success">Approved</Badge>;
    case 'rejected':
      return <Badge variant="destructive">Rejected</Badge>;
    case 'cancelled':
      return <Badge variant="secondary">Cancelled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
