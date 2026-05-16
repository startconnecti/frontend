'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PaymentInstruction } from '../types/index';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface PaymentInstructionModalProps {
  isOpen: boolean;
  onClose: () => void;
  instruction: PaymentInstruction;
}

export function PaymentInstructionModal({
  isOpen,
  onClose,
  instruction,
}: PaymentInstructionModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Payment Instructions</DialogTitle>
          <DialogDescription>
            Please complete the manual bank transfer using the details below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {instruction.qrImageUrl && (
            <div className="flex justify-center">
              <img
                src={instruction.qrImageUrl}
                alt="Payment QR Code"
                className="w-48 h-48 border rounded-lg"
              />
            </div>
          )}

          <div className="space-y-3">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-sm text-muted-foreground">Amount</span>
              <span className="text-lg font-black text-brand-dark">
                ${instruction.amount.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-sm text-muted-foreground">Bank</span>
              <span className="text-sm font-medium">{instruction.bankName}</span>
            </div>

            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-sm text-muted-foreground">Account Name</span>
              <span className="text-sm font-medium">{instruction.bankAccountName}</span>
            </div>

            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-sm text-muted-foreground">Account Number</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono font-bold">{instruction.bankAccountNumber}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => copyToClipboard(instruction.bankAccountNumber, 'account')}
                >
                  {copiedField === 'account' ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-sm text-muted-foreground">Transfer Note</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono font-bold text-primary">{instruction.transferNote}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => copyToClipboard(instruction.transferNote, 'note')}
                >
                  {copiedField === 'note' ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-destructive/10 p-3 rounded-lg text-xs font-medium text-destructive">
            <strong>Critical:</strong> You must use the EXACT transfer note above for the system to recognize your payment automatically.
          </div>

          {instruction.supportMessage && (
            <p className="text-xs text-muted-foreground text-center">
              {instruction.supportMessage}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="w-full">
            I Have Transferred
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
