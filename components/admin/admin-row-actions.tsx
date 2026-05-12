'use client';

import Link from 'next/link';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminConfirmDialog } from './admin-confirm-dialog';

interface AdminRowActionsProps {
  viewHref: string;
  editHref?: string;
  onDelete?: () => void;
  showEdit?: boolean;
  showDelete?: boolean;
  showView?: boolean;
}

export function AdminRowActions({
  viewHref,
  editHref,
  onDelete,
  showEdit = true,
  showDelete = true,
  showView = true,
}: AdminRowActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {showView && (
        <Link href={viewHref}>
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
            <span className="sr-only">View</span>
          </Button>
        </Link>
      )}
      {showEdit && editHref && (
        <Link href={editHref}>
          <Button variant="ghost" size="sm">
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
        </Link>
      )}
      {showDelete && onDelete && (
        <AdminConfirmDialog
          title="Delete record"
          description="Are you sure you want to delete this record? This action cannot be undone."
          actionLabel="Delete"
          actionVariant="destructive"
          triggerLabel=""
          triggerVariant="ghost"
          onConfirm={onDelete}
        >
          <Button variant="ghost" size="sm">
            <Trash2 className="h-4 w-4 text-red-500" />
            <span className="sr-only">Delete</span>
          </Button>
        </AdminConfirmDialog>
      )}
    </div>
  );
}
