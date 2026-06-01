'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { StudentDisputeForm } from './student-dispute-form';
import { useIsMobile } from '@/hooks/use-mobile';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';

export interface StudentDisputeCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionId: string;
}

export function StudentDisputeCreateDialog({
  open,
  onOpenChange,
  sessionId,
}: StudentDisputeCreateDialogProps) {
  const isMobile = useIsMobile();

  const handleSuccess = () => {
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh]">
          <div className="overflow-y-auto px-4 pb-8">
            <DrawerHeader className="px-0">
              <DrawerTitle>Report an Issue</DrawerTitle>
              <DrawerDescription>
                Provide details about the issue you experienced. Our team will review this request.
              </DrawerDescription>
            </DrawerHeader>
            <StudentDisputeForm
              sessionId={sessionId}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Report an Issue</DialogTitle>
          <DialogDescription>
            Please provide details about the issue you experienced. Our team will review this request and get back to you.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <StudentDisputeForm
            sessionId={sessionId}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
