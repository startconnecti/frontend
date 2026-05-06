'use client';

import { X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminConfirmDialog } from './admin-confirm-dialog';
import { useState } from 'react';

interface AdminBulkActionBarProps {
  selectedCount: number;
  onBulkDelete: () => void;
}

export function AdminBulkActionBar({ selectedCount, onBulkDelete }: AdminBulkActionBarProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  if (selectedCount === 0) {
    return null;
  }

  return (
    <>
      <div className="flex items-center gap-4 border-b border-border bg-muted px-6 py-3">
        <span className="text-sm font-medium text-foreground">
          {selectedCount} selected
        </span>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setDeleteDialogOpen(true)}
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Bulk Delete
        </Button>
      </div>

      <AdminConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete selected records"
        description={`Are you sure you want to delete ${selectedCount} record${selectedCount > 1 ? 's' : ''}? This action cannot be undone.`}
        onConfirm={() => {
          onBulkDelete();
          setDeleteDialogOpen(false);
        }}
      />
    </>
  );
}
