'use client';

import { X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminBulkActionsProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkDelete: () => void;
}

export function AdminBulkActions({ selectedCount, onClearSelection, onBulkDelete }: AdminBulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-4 bg-muted border-b border-border px-6 py-4 animate-in fade-in">
      <span className="text-sm font-medium text-foreground">
        {selectedCount} selected
      </span>
      <div className="flex-1" />
      <Button
        variant="destructive"
        size="sm"
        onClick={onBulkDelete}
        className="gap-2"
      >
        <Trash2 className="h-4 w-4" />
        Bulk Delete
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearSelection}
        className="gap-2"
      >
        <X className="h-4 w-4" />
        Clear
      </Button>
    </div>
  );
}
