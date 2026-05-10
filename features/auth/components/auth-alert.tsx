'use client';

import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface AuthAlertProps {
  type: 'error' | 'success';
  title: string;
  message: string;
  className?: string;
}

export function AuthAlert({ type, title, message, className }: AuthAlertProps) {
  const isError = type === 'error';

  return (
    <Alert 
      variant={isError ? 'destructive' : 'default'} 
      className={className}
    >
      {isError ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {message}
      </AlertDescription>
    </Alert>
  );
}
