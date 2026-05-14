'use client';

import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface AdminConfirmDialogProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionVariant?: 'default' | 'destructive';
  onConfirm: () => void;
  onCancel?: () => void;
  triggerLabel?: string;
  triggerVariant?: 'default' | 'destructive' | 'outline' | 'ghost';
  triggerDisabled?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export function AdminConfirmDialog({
  title,
  description,
  actionLabel = 'Confirm',
  actionVariant = 'default',
  onConfirm,
  onCancel,
  triggerLabel,
  triggerVariant = 'default',
  triggerDisabled = false,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  children,
}: AdminConfirmDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = (newOpen: boolean) => {
    if (isControlled) {
      setControlledOpen?.(newOpen);
    } else {
      setUncontrolledOpen(newOpen);
    }
  };

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  const handleCancel = () => {
    onCancel?.();
    setOpen(false);
  };

  return (
    <>
      {children ? (
        <div onClick={() => !triggerDisabled && setOpen(true)}>{children}</div>
      ) : (
        <Button
          variant={triggerVariant}
          disabled={triggerDisabled}
          onClick={() => setOpen(true)}
        >
          {triggerLabel || 'Open'}
        </Button>
      )}

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className={actionVariant === 'destructive' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}
            >
              {actionLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
